import express from 'express';
import cors from 'cors';
import { config } from './config';
import { logger, httpLogger } from './utils/logger';
import { myappDB } from './db/pool';
import garmentsRouter from './routes/garments';
import materialsRouter from './routes/materials';
import attributesRouter from './routes/attributes';
import suppliersRouter from './routes/suppliers';

const app = express();

app.use(cors());
app.use(express.json());
app.use(httpLogger);

app.get('/health', async (req, res) => {
  try {
    const connection = await myappDB.getConnection();
    await connection.ping();
    connection.release();
    
    res.json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'error', 
      database: 'disconnected',
      timestamp: new Date().toISOString() 
    });
  }
});

app.get('/api', (req, res) => {
  res.json({ 
    message: 'Fashion PLM API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      garments: '/api/garments',
      materials: '/api/materials',
      attributes: '/api/attributes',
      suppliers: '/api/suppliers',
    }
  });
});

app.use('/api/garments', garmentsRouter);
app.use('/api/materials', materialsRouter);
app.use('/api/attributes', attributesRouter);
app.use('/api/suppliers', suppliersRouter);

const startServer = async () => {
  try {
    const connection = await myappDB.getConnection();
    await connection.ping();
    connection.release();
    logger.info('Database connection established');

    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
