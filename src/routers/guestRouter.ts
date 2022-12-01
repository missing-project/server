import { Router } from 'express';
import { guestController } from '../controller';
import { asyncHandler } from '../utils';

export const guestRouter = Router();

guestRouter.post('/login', asyncHandler(guestController.loginUser));
guestRouter.post('/register', asyncHandler(guestController.registerUser));
guestRouter.post('/authmail', asyncHandler(guestController.authEmail));
guestRouter.post('/resetpw', asyncHandler(guestController.resetPW));
guestRouter.post('/checkid', asyncHandler(guestController.checkId));
/*
회원가입 관련 필요 데이터
uid, email, password, name, device, role, active
*/
