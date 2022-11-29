import { Router } from 'express';
import { guestController } from '../controller';
import { asyncHandler } from '../utils';

export const guestRouter = Router();
guestRouter.get('/home', (req, res) => {
  res.send('hello Guest!');
});
guestRouter.get('/', asyncHandler(guestController.loginUser));
guestRouter.post('/', asyncHandler(guestController.registerUser));
guestRouter.post('/authmail', asyncHandler(guestController.authEmail));
/*
회원가입 관련 필요 데이터
uid, email, password, name, device, role, active
*/
