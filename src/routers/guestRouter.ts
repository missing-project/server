import { Router } from 'express';
import { guestController, userController } from '../controller';
import { asyncHandler } from '../utils';

export const guestRouter = Router();

guestRouter.post('/login', asyncHandler(guestController.loginUser));
guestRouter.post('/checkid', asyncHandler(guestController.checkId));
guestRouter.post('/authmail', asyncHandler(guestController.authEmail));
guestRouter.post('/register', asyncHandler(guestController.registerUser));
guestRouter.post('/searchId', asyncHandler(guestController.searchId));
guestRouter.post('/changePassword', asyncHandler(userController.updateUser));
guestRouter.get('/notice', asyncHandler(guestController.getNotice));
guestRouter.get('/appinfo', asyncHandler(guestController.getAppinfo));
