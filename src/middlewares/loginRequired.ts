import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils';
import { userService } from '../services/userService';
import jwt from 'jsonwebtoken';

export async function loginRequired(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // 토큰 타입 acc, ref로 토큰 분류
  const tokenType = req.headers.authorization?.split(' ')[0]; // acc || ref
  const token = req.headers.authorization?.split(' ')[1];

  if (!token || token === 'null') {
    errorResponse(
      res,
      'FORBIDDEN',
      '로그인한 유저만 사용할 수 있는 서비스입니다.'
    );
  }

  if (!(tokenType === 'access' || tokenType === 'refresh')) {
    errorResponse(res, 'FORBIDDEN', '정상적인 토큰이 아닙니다');
  }

  if (tokenType == 'access') {
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
  } else if (tokenType === 'refresh') {
    // refresh 토큰 -> 갱신
    const result = await userService.expandAccToken(<string>token);
    res.json(result);
  }
}
