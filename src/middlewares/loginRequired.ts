import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export async function loginRequired(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // 토큰 타입 access || refresh
  const tokenType = req.headers.authorization?.split(' ')[0];
  const token = req.headers.authorization?.split(' ')[1];

  if (!token || token === 'null') {
    next(new Error('로그인한 유저만 사용할 수 있는 서비스입니다.'));
  }

  if (!(tokenType === 'access' || tokenType === 'refresh')) {
    next(new Error('정상적인 토큰이 아닙니다'));
  }

  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    const jwtDecoded = jwt.verify(token, secretKey);
    const { uid, role } = <{ uid: string; role: string }>jwtDecoded;
    req.body.uid = uid;
    req.body.role = role;
    next();
  } catch (error) {
    next(error);
  }
}
