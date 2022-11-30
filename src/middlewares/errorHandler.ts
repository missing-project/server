import { ErrorRequestHandler } from 'express';
import { errorResponse } from '../utils';
import { logger } from '../winston';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logger.error('\x1b[33m%s\x1b[0m', err.stack);
  errorResponse(res, 'BADREQUEST', err.message);
};
