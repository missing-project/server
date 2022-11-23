import { Router } from 'express';
import { bookmarkController } from '../controller';
import { asyncHandler } from '../utils';

export const bookmarkRouter = Router();

bookmarkRouter.get('/:userEmail', asyncHandler(bookmarkController.getBookmark));
bookmarkRouter.post('/', asyncHandler(bookmarkController.postBookmark));
bookmarkRouter.delete('/:caseid', asyncHandler(bookmarkController.deleteOneBookmark));