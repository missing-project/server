import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils';
import { userService } from '../services/userService';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config({ path: '../../.env' });
export async function loginRequired(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const accessToken = req.headers.authorization?.split(' ')[1];
  const refreshToken: string | undefined = req.headers.cookie?.split(':')[1];

  if (!accessToken || accessToken === 'null') {
    errorResponse(
      res,
      'FORBIDDEN',
      '로그인한 유저만 사용할 수 있는 서비스입니다.'
    );
  }
  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    const jwtDecoded = jwt.verify(accessToken, secretKey);
    const uid = (<{ uid: string }>jwtDecoded).uid;
    const role = (<{ role: string }>jwtDecoded).role;
    const device = (<{ device: string }>jwtDecoded).device;
    req.body.uid = uid;
    req.body.role = role;
    req.body.device = device;
    next();
  } catch (error) {
    // error type일 경우에만 에러처리
    if (error instanceof Error) {
      if (error.message === 'jwt expired') {
        if (!refreshToken) {
          errorResponse(res, 'NOTFOUND', "can't found RefreshToken");
        } else {
          // refresh 토큰 -> 갱신
          const result = await userService.expandAccToken(<string>refreshToken);
          res.json(result);
        }
      }
    } else {
      errorResponse(res, 'BADREQUEST', 'abnomal Error : Non Error Type');
    }
  }
}
