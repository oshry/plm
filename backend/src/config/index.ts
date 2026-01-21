import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  MYSQL_SOCKET_PATH: process.env.MYSQL_SOCKET_PATH,
  DATABASE: {
    HOST: process.env.DB_HOST || 'localhost',
    PORT: parseInt(process.env.DB_PORT || '3306', 10),
    USER: process.env.DB_USERNAME || 'plm_user',
    PASSWORD: process.env.DB_PASSWORD || 'plm_password',
    MYAPP_DB: process.env.DB_DATABASE || 'fashion_plm',
  },
};
