import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils';
// import jwt from "jsonwebtoken";
/* 
저희가 어플 서비스인데 라이브러리 이름이 jsonwebtoken 이라서 
회원 쪽 담당하시는 분이 해당 라이브러리가 프로젝트에 적합할 것 같은지 확인 한번 해주시면 감사하겠습니다
*/

function loginRequired(req: Request, res: Response, next: NextFunction) {
  const userToken = req.headers.authorization?.split(' ')[1];
  if (!userToken || userToken === 'null') {
    console.log('서비스 사용 요청이 있습니다.하지만, Authorization 토큰: 없음');
    errorResponse(
      res,
      'FORBIDDEN',
      '로그인한 유저만 사용할 수 있는 서비스입니다.'
    );

    return;
  }

  try {
    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';
    // const jwtDecoded = jwt.verify(userToken, secretKey);
    next();
  } catch (error) {
    errorResponse(res, 'FORBIDDEN', '정상적인 토큰이 아닙니다.');

    return;
  }
}

export { loginRequired };
