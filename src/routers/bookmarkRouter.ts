import { Router } from 'express';
import { bookmarkController } from '../controller';
import { asyncHandler } from '../utils';

export const bookmarkRouter = Router();

bookmarkRouter.get('/', asyncHandler(bookmarkController.getBookmark));
bookmarkRouter.post('/', asyncHandler(bookmarkController.postBookmark));
bookmarkRouter.delete('/', asyncHandler(bookmarkController.deleteOneBookmark));
