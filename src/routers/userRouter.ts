import { Router } from 'express';
import { userController } from '../controller';
import { asyncHandler } from '../utils';

export const userRouter = Router();

userRouter.get('/:uid', asyncHandler(userController.getUser));
userRouter.post('/',asyncHandler(userController.postUser));
userRouter.delete('/:uid', asyncHandler(userController.deleteUser));
userRouter.patch('/active/:uid' ,asyncHandler(userController.activeUser));
userRouter.patch('/inactive/:uid' ,asyncHandler(userController.inactiveUser));
userRouter.patch('/:uid', asyncHandler(userController.updateUser))
