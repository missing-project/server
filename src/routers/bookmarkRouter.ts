import { Router } from 'express';
import { bookmarkController } from '../controller';
import { asyncHandler } from '../utils';

export const bookmarkRouter = Router();

bookmarkRouter.get('/:userId', asyncHandler(bookmarkController.getBookmark));
bookmarkRouter.post('/', asyncHandler(bookmarkController.postBookmark));
bookmarkRouter.delete('/:caseKey/:userId', asyncHandler(bookmarkController.deleteOneBookmark));