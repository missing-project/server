import { Response } from 'express';
import { ErrorType } from '../types';

export const errorResponse = (
  res: Response,
  type: ErrorType,
  message?: string
) => {
  switch (type) {
    case 'FORBIDDEN':
      return res.status(403).json({ message });
    case 'NOTFOUND':
      return res.status(404).json({ message });
    case 'SERVER':
      return res.status(500).json({ message });
    default:
      return res.status(500).json({ message });
  }
};
