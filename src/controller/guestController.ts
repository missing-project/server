import { userService } from '../services';
import { AsyncRequestHandler } from '../types';

interface guestControllerInterface {
  loginUser: AsyncRequestHandler;
  registerUser: AsyncRequestHandler;
  authEmail: AsyncRequestHandler;
  checkId: AsyncRequestHandler;
  searchId: AsyncRequestHandler;
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
    const user = await userService.findUser(id);
    res.json({ isUsable: Boolean(!user?.uid) });
  },

  async searchId(req, res) {
    const { email } = req.body;
    const user = await userService.findUserByEmail(email);
    res.json({ id: user ? user.uid : null });
  },
};
