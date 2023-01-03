import { Router } from 'express';
import { userController } from '../controller';
import { asyncHandler } from '../utils';

export const userRouter = Router();

//유저정보 확인
userRouter.get('/me', asyncHandler(userController.getUser));
//유저정보 수정
userRouter.patch('/', asyncHandler(userController.updateUser));
//탈퇴
userRouter.delete('/', asyncHandler(userController.deleteUser));
//계정 활성화
userRouter.patch('/active/', asyncHandler(userController.activeUser));
//계정 비활성화
userRouter.patch('/inactive/', asyncHandler(userController.inactiveUser));

userRouter.get(
  '/remember',
  asyncHandler(async (req, res, next) => {
    await userController.tokenRefresh(req, res, next, true);
  })
);

userRouter.get(
  '/refresh',
  asyncHandler(async (req, res, next) => {
    await userController.tokenRefresh(req, res, next, false);
  })
);

userRouter.post('/changePassword', asyncHandler(userController.changePassword));
