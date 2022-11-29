import { Router } from 'express';
import { bookmarkController } from '../controller';
import { loginRequired } from '../middlewares';
import { asyncHandler } from '../utils';

export const bookmarkRouter = Router();

bookmarkRouter.get(
  '/',
  loginRequired,
  asyncHandler(bookmarkController.getBookmark)
);
bookmarkRouter.post(
  '/',
  loginRequired,
  asyncHandler(bookmarkController.postBookmark)
);
bookmarkRouter.delete(
  '/:key',
  asyncHandler(bookmarkController.deleteOneBookmark)
);
