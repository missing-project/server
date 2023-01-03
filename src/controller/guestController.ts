import { userService } from '../services';
import { guestService } from '../services';
import { AsyncRequestHandler } from '../types';

interface guestControllerInterface {
  loginUser: AsyncRequestHandler;
  registerUser: AsyncRequestHandler;
  authEmail: AsyncRequestHandler;
  checkId: AsyncRequestHandler;
  searchId: AsyncRequestHandler;
  getNotice: AsyncRequestHandler;
  getAppinfo: AsyncRequestHandler;
  resetPassword: AsyncRequestHandler;
}

export const guestController: guestControllerInterface = {
  async loginUser(req, res) {
    const uid = req.body.uid;
    const password = req.body.password;
    const user = await userService.loginUser({ uid, password });
    res.json(user);
  },

  async registerUser(req, res) {
    const user = await userService.createUser(req.body);
    res.json({ user });
  },

  async authEmail(req, res) {
    const result = await userService.authEmail(req.body.email);
    res.json(result);
  },

  async checkId(req, res) {
    const { id } = req.body;
    const user = await userService.findUserByUid(id);
    res.json({ isUsable: Boolean(!user?.uid) });
  },

  async searchId(req, res) {
    const { email } = req.body;
    const user = await userService.findUserByEmail(email);
    res.json({ id: user ? user.uid : null });
  },

  async getNotice(_, res) {
    const notice = await guestService.getNotice();
    res.json(notice);
  },

  async getAppinfo(_, res) {
    const appinfo = await guestService.getAppinfo();
    res.json(appinfo);
  },

  async resetPassword(req, res) {
    const { uid, email } = req.body;
    const user = await userService.findUser({ uid, email });
    if (!user) {
      throw new Error('해당 정보에 맞는 사용자가 존재하지 않습니다');
    }
    const randomStr = Math.random().toString(36).substring(2, 12);
    const result = await userService.passwordEmail(email, randomStr);
    await userService.updateUser(uid, {
      email,
      password: randomStr,
    });
    res.json(result);
  },
};
