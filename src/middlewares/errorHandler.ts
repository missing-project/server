import { ErrorRequestHandler } from 'express';
import { errorResponse } from '../utils';
import { logger } from '../winston';

export const errorHandler: ErrorRequestHandler = (err, req, res) => {
  logger.error('\x1b[33m%s\x1b[0m', err.stack);
  errorResponse(res, 'BADREQUEST', err.message);
};
