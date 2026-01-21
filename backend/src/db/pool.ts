import mysql, {
  PoolCluster,
  PoolClusterOptions,
  ResultSetHeader,
  RowDataPacket,
  ProcedureCallPacket,
} from "mysql2/promise";
import { config } from "../config";

declare module "mysql2/promise" {
  interface PoolCluster {
    end(callback?: (err: NodeJS.ErrnoException | null) => void): void;
  }
}

// Reusable type for queries
export type CustomQueryResult =
  | ResultSetHeader
  | ResultSetHeader[]
  | RowDataPacket[]
  | RowDataPacket[][]
  | ProcedureCallPacket;

const poolClusterOptions: PoolClusterOptions = {
  canRetry: true,
  removeNodeErrorCount: 5,
  defaultSelector: "RR",
};

const getDbHost = () => {
  if (process.env.NODE_ENV === "production") {
    return {
      socketPath: config.MYSQL_SOCKET_PATH,
    };
  }
  return {
    host: config.DATABASE.HOST || "127.0.0.1",
    port: config.DATABASE.PORT || 3306,
  };
};

const connectionConfig = {
  ...getDbHost(),
  user: config.DATABASE.USER,
  password: config.DATABASE.PASSWORD,
  timezone: "UTC",
  connectTimeout: 10_000,
  debug: false,
  multipleStatements: false,
};

const poolConfig = {
  ...connectionConfig,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 50,
  acquireTimeout: 10_000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 60_000,
  idleTimeout: 30_000,
  maxIdle: 10,
  minIdle: 2,
};

export const poolCluster: PoolCluster = mysql.createPoolCluster(
  poolClusterOptions
);

// Log the actual config being used
console.log("Attempting to add MYAPP_DB pool with config:", {
  socketPath: connectionConfig.socketPath,
  host: connectionConfig.host,
  port: connectionConfig.port,
  user: config.DATABASE.USER,
  database: config.DATABASE.MYAPP_DB,
});

try {
  poolCluster.add("MYAPP_DB", {
    ...poolConfig,
    database: config.DATABASE.MYAPP_DB,
  });
  console.log("Successfully added MYAPP_DB pool to cluster");
} catch (error) {
  console.error("Failed to add MYAPP_DB pool:", error);
  throw error;
}

poolCluster.on("error", (err) => {
  console.error("Pool cluster error:", err);
});

// Optional: log status
const logPoolStatus = () => {
  try {
    const poolStatus = {
      date: new Date().toISOString(),
      config: poolConfig,
      message: "Database pool is active",
    };
    console.log("Database pool status:", poolStatus);
  } catch (error) {
    console.error("Error checking pool status:", error);
  }
};

const statusInterval = setInterval(logPoolStatus, 5 * 60 * 1000);

process.on("exit", () => clearInterval(statusInterval));

// Graceful shutdown
const shutdown = () => {
  console.log("Shutting down database connections...");

  const forceExitTimeout = setTimeout(() => {
    console.log("Force exiting after timeout");
    process.exit(0);
  }, 3000);

  try {
    poolCluster.end((error: NodeJS.ErrnoException | null) => {
      if (error) {
        console.error("Error closing database connections:", error);
      } else {
        console.log("Database connections closed.");
      }

      clearTimeout(forceExitTimeout);
      process.exit(0);
    });
  } catch (error) {
    console.error("Error during shutdown:", error);
    clearTimeout(forceExitTimeout);
    process.exit(1);
  }
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

export const myappDB = poolCluster.of("MYAPP_DB");