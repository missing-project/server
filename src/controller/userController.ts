import { userService } from '../services';
import { AsyncRequestHandler } from '../types';

interface userControllerInterface {
  getUser: AsyncRequestHandler;
  postUser: AsyncRequestHandler;
  deleteUser: AsyncRequestHandler;
  updateUser: AsyncRequestHandler;
  activeUser: AsyncRequestHandler;
  inactiveUser: AsyncRequestHandler;
  tokenRefresh: AsyncRequestHandler;
}

export const userController: userControllerInterface = {
  async getUser(req, res) {
    const { uid } = req.body;
    const users = await userService.findUserByUid(uid);
    res.json({ users });
  },

  async postUser(req, res) {
    const user = await userService.createUser(req.body);
    res.json({ user });
  },

  async updateUser(req, res) {
    const { uid } = req.body;
    const user = await userService.updateUser(uid, req.body);
    res.json({ user });
  },

  async deleteUser(req, res) {
    const { uid } = req.body;
    const user = await userService.deleteUser(uid);
    res.json({ user });
  },

  async activeUser(req, res) {
    const { uid } = req.body;
    const user = await userService.activeUser(uid);
    res.json({ user });
  },

  async inactiveUser(req, res) {
    const { uid } = req.body;
    const user = await userService.activeUser(uid);
    res.json({ user });
  },

  async tokenRefresh(req, res, _, isLogin: boolean) {
    const token = req.headers.authorization?.split(' ')[1];
    const refreshed = await userService.expandAccToken(token, isLogin);
    res.json(refreshed);
  },
};
