import type {
  FieldPacket,
  PoolNamespace,
  PoolConnection,
} from "mysql2/promise";
import type { CustomQueryResult } from "./pool";
import { dbAuditLogger } from "../audit/dbAuditLogger";

export async function executeQuery<T extends CustomQueryResult>(
  DB: PoolNamespace,
  query: string,
  values?: unknown,
  options?: { audit?: boolean } // optional override
): Promise<[T, FieldPacket[]]> {
  const connection = await DB.getConnection();

  try {
    const [result, fields] = await connection.query<T>(query, values);

    const shouldAudit =
      options?.audit ?? true; // default: audit on (INSERT/UPDATE will be filtered inside)

    if (shouldAudit) {
      await dbAuditLogger.log(connection, query, values);
    }

    return [result, fields];
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  } finally {
    await connection.release();
  }
}

export async function transactionQuery<T extends CustomQueryResult>(
  connection: PoolConnection,
  query: string,
  values?: unknown,
  options?: { audit?: boolean }
): Promise<[T, FieldPacket[]]> {
  const [result, fields] = await connection.query<T>(query, values);

  const shouldAudit = options?.audit ?? true;

  if (shouldAudit) {
    await dbAuditLogger.log(connection, query, values);
  }

  return [result, fields];
}

export async function escapeId(DB: PoolNamespace, value: string) {
  const connection = await DB.getConnection();
  try {
    return connection.escapeId(value);
  } finally {
    await connection.release();
  }
}