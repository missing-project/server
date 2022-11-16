import { ErrorRequestHandler } from 'express';
import { errorResponse } from '../utils';

export const errorHandler: ErrorRequestHandler = (err, req, res) => {
  console.log('\x1b[33m%s\x1b[0m', err.stack);
  errorResponse(res, 'BADREQUEST', err.message);
};
