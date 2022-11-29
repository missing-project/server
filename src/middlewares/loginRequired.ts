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
  // 토큰 타입 acc, ref로 토큰 분류
  const tokenType = req.headers.authorization?.split(' ')[0]; // acc || ref
  const Token = req.headers.authorization?.split(' ')[1];

  if (!Token || Token === 'null') {
    errorResponse(
      res,
      'FORBIDDEN',
      '로그인한 유저만 사용할 수 있는 서비스입니다.'
    );
  }

  if (!(tokenType === 'acc' || tokenType === 'ref')) {
    errorResponse(res, 'FORBIDDEN', '정상적인 토큰이 아닙니다');
  }

  if (tokenType == 'acc') {
    try {
      const secretKey = process.env.JWT_SECRET_KEY;
      const jwtDecoded = jwt.verify(Token, secretKey);
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
          const result = {
            status: 'request',
            message: 'request RefreshToken for assigning Token',
          };
          res.json({ result });
        }
      } else {
        errorResponse(res, 'BADREQUEST', 'abnomal Error : Non Error Type');
      }
    }
  } else if (tokenType === 'ref') {
    // refresh 토큰 -> 갱신
    const result = await userService.expandAccToken(<string>Token);
    res.json(result);
  }
}
