import { Request, Response } from 'express';

export const indexRouter = (req: Request, res: Response) => {
  res.send('welcome!');
};
