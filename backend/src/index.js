import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { validateApiKey } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiRateLimit } from './middleware/rateLimit.js';
import logger from './utils/logger.js';

// Route imports
import chatRouter from './routes/chat.js';
import timelineRouter from './routes/timeline.js';
import searchRouter from './routes/search.js';
import civicRouter from './routes/civic.js';

const app = express();
const PORT = process.env.PORT || 8080;

// Enable trust proxy for Netlify/Cloud environments
app.set('trust proxy', 1);

// Request Logging for Debugging
app.use((req, res, next) => {
  logger.info(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*'
}));
app.use(compression());
app.use(express.json({ limit: '10kb' })); // Security: Limit body size

// Diagnostic ping
app.get('/ping', (req, res) => res.send('pong'));

// Health check (Exempt from API key)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Key Validation
app.use(validateApiKey);

// Routes - Dual mounting for Netlify compatibility
const mountRoutes = (basePath) => {
  app.use(`${basePath}/chat`, chatRouter);
  app.use(`${basePath}/timeline`, timelineRouter);
  app.use(`${basePath}/search`, searchRouter);
  app.use(`${basePath}/civic`, civicRouter);
};

mountRoutes('/api');
mountRoutes(''); // Also mount at root for when /api is stripped

// Error Handler
app.use(errorHandler);

// Listen
if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    logger.info(`ElectIQ backend running on port ${PORT} ✅`);
  });
}

export default app;
