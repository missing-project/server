import { Router } from 'express';
import { missingPersonController } from '../controller';
import { asyncHandler } from '../utils';

export const missingPersonRouter = Router();

missingPersonRouter.get('/mp', asyncHandler(missingPersonController.getMissingPersons));
missingPersonRouter.post('/mp', asyncHandler(missingPersonController.postMissingPerson));
