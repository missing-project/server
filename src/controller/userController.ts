import { userService } from '../services';
import { AsyncRequestHandler } from '../types';

interface userControllerInterface {
  getUser: AsyncRequestHandler;
  postUser: AsyncRequestHandler;
}

/* 
컨트롤러에서는 비즈니스로직을 작성하지 마시오!
req, res 활용하여 client와의 상호작용만을 다루는 레이어 입니다.
*/

export const userController: userControllerInterface = {
  async getUser(req, res) {
    const { uid } = req.params;
    const users = await userService.findUser(uid);
    res.json({ users });
  },

  async postUser(req, res) {
    const user = await userService.createUser(req.body);
    res.json({ user });
  },
};
