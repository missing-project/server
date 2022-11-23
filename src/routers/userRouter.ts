import { Router } from 'express';
import { userController } from '../controller';
import { asyncHandler } from '../utils';
import { loginRequired } from '../middlewares';
export const userRouter = Router();

//유저정보 확인
userRouter.get('/', loginRequired, asyncHandler(userController.getUser));
//유저정보 수정
userRouter.patch('/', loginRequired, asyncHandler(userController.updateUser))
//탈퇴
userRouter.delete('/', loginRequired, asyncHandler(userController.deleteUser));
//계정 활성화
userRouter.patch('/active/', loginRequired, asyncHandler(userController.activeUser));
//계정 비활성화
userRouter.patch('/inactive/' , loginRequired, asyncHandler(userController.inactiveUser));
