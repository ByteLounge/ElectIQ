import logger from '../utils/logger.js';

/**
 * Centralized error handler for the Express application.
 * @param {Error} err - The error object.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || 'An unexpected error occurred';

  // Log only the stack in dev or minimal info in prod
  if (process.env.NODE_ENV !== 'production') {
    logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, { stack: err.stack });
  } else {
    logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  }

  res.status(statusCode).json({
    error: message,
    status: statusCode,
    timestamp: new Date().toISOString()
  });
};
