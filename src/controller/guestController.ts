import { userService } from '../services';
import { AsyncRequestHandler } from '../types';
/*
게스트에서 작동되는 기능 : 회원가입, 로그인
*/
interface guestControllerInterface {
  loginUser: AsyncRequestHandler;
  registerUser: AsyncRequestHandler;
  authEmail: AsyncRequestHandler;
  resetPW: AsyncRequestHandler;
}

/* 
컨트롤러에서는 비즈니스로직을 작성하지 마시오!
req, res 활용하여 client와의 상호작용만을 다루는 레이어 입니다.
*/

// 아래 uid가 반드시 req body에 반영되도록 프론트에서 확인처리 필요!!
export const guestController: guestControllerInterface = {
  async loginUser(req, res) {
    const uid = req.body.uid;
    const password = req.body.password;
    const user = await userService.loginUser({ uid, password });
    res.json({ user });
  },

  async registerUser(req, res) {
    const user = await userService.createUser(req.body);
    res.json({ user });
  },

  // 회원가입 간 이메일 인증 과정
  async authEmail(req, res) {
    const result = await userService.authEmail(req.body.email);
    res.json(result);
  },

  async resetPW(req, res) {
    const result = await userService.resetPassword(
      req.body.uid,
      req.body.email
    );
    res.json(result);
  },

};
