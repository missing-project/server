import { userService } from '../services';
import { AsyncRequestHandler } from '../types';

interface userControllerInterface {
  getUser: AsyncRequestHandler;
  postUser: AsyncRequestHandler;
  deleteUser: AsyncRequestHandler;
  updateUser: AsyncRequestHandler;
  activeUser: AsyncRequestHandler;
  inactiveUser: AsyncRequestHandler;
}

/* 
컨트롤러에서는 비즈니스로직을 작성하지 마시오!
req, res 활용하여 client와의 상호작용만을 다루는 레이어 입니다.
*/

export const userController: userControllerInterface = {
  async getUser(req, res) {
    const uid = (req.body.uid);
    const users = await userService.findUser(uid);
    res.json({ users });
  },

  /* postUser는 현재 회원가입시에만 사용 */
  async postUser(req, res) {
    const user = await userService.createUser(req.body);
    res.json({ user });
  },

  async updateUser(req, res){
    const user = await userService.updateUser(req.body);
    res.json({user});
  },

  async deleteUser(req, res){
    const uid  = req.body.uid
    const user = await userService.deleteUser(uid);
    res.json({user});
  },

  async activeUser(req, res){
    const  uid  = req.body.uid;
    const user = await userService.activeUser(uid);
    res.json({user})
  }, 

  async inactiveUser(req, res){
    const uid = req.body.uid;
    const user = await userService.activeUser(uid);
    res.json({user})
  } 

};
