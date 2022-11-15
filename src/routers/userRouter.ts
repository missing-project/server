import { Router } from 'express';
import { userController } from '../controller';
import { asyncHandler } from '../utils';

export const userRouter = Router();

userRouter.get('/:uid', asyncHandler(userController.getUser));
userRouter.post('/', asyncHandler(userController.postUser));
