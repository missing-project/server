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
    return;
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
          errorResponse(
            res,
            'FORBIDDEN',
            '토큰이 만료되었으나 갱신할 수 없어 다시 로그인 해주시기 바랍니다'
          );
          return;
        }
        const uid = req.body.uid;
        const token = await userService.expandAccToken(
          uid,
          <string>refreshToken
        );

        return {
          result: false,
          reason: 'expired token',
          newToken: token,
        };
      } else {
        errorResponse(res, 'FORBIDDEN', error.message);
        return;
      }
    } else {
      // verify에서 에러타입이 에러를 반환한경우
      return {
        result: false,
        reason: 'abnoraml Error',
      };
    }
  }
}
