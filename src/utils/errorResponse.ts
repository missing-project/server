import { Response } from 'express';

export const errorResponse = (res: Response, status: any, message?: string) => {
  res.status(typeof status === 'number' ? status : 500).json({ message });
};
