import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log('\x1b[33m%s\x1b[0m', err.stack);
  res.status(400).json({ result: 'error', reason: err.message });
};

export { errorHandler };
