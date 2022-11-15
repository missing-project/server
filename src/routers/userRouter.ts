import { Router } from 'express';
import { userController } from '../controller';
import { asyncHandler } from '../utils';

const userRouter = Router();

userRouter.get('/', asyncHandler(userController.getUser));
userRouter.post('/', asyncHandler(userController.postUser));

export { userRouter };
