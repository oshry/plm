import type { PoolConnection } from "mysql2/promise";
import { logger } from "../utils/logger";

class DbAuditLogger {
  async log(
    connection: PoolConnection,
    query: string,
    values?: unknown
  ): Promise<void> {
    const isModifyingQuery = /^(INSERT|UPDATE|DELETE)/i.test(query.trim());
    
    if (isModifyingQuery) {
      logger.info({
        type: "db_audit",
        query: query.substring(0, 200),
        values: values ? JSON.stringify(values).substring(0, 100) : undefined,
        timestamp: new Date().toISOString(),
      });
    }
  }
}

export const dbAuditLogger = new DbAuditLogger();
