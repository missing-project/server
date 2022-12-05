import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export async function loginRequired(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // 토큰 타입 acc, ref로 토큰 분류
  const tokenType = req.headers.authorization?.split(' ')[0]; // access || refresh
  const token = req.headers.authorization?.split(' ')[1];

  if (!token || token === 'null') {
    next(new Error('로그인한 유저만 사용할 수 있는 서비스입니다.'));
  }

  if (!(tokenType === 'access')) {
    next(new Error('정상적인 토큰이 아닙니다'));
  }

  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    const jwtDecoded = jwt.verify(token, secretKey);
    const uid = (<{ uid: string }>jwtDecoded).uid;
    const role = (<{ role: string }>jwtDecoded).role;
    req.body.uid = uid;
    req.body.role = role;
    next();
  } catch (error) {
    // error type일 경우에만 에러처리
    if (error instanceof Error && error.message === 'jwt expired') {
      next(new Error('request RefreshToken for assigning Token'));
    } else {
      next(error);
    }
  }
}
