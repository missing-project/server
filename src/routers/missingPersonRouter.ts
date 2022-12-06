import { Router } from 'express';
import { missingPersonController } from '../controller';
import { asyncHandler } from '../utils';

export const missingPersonRouter = Router();

missingPersonRouter.get(
  '/',
  asyncHandler(missingPersonController.getMissingPersons)
);
missingPersonRouter.post(
  '/',
  asyncHandler(missingPersonController.postMissingPerson)
);
missingPersonRouter.delete(
  '/:caseId',
  asyncHandler(missingPersonController.deleteOneMissingPerson)
);
missingPersonRouter.get(
  '/:caseId',
  asyncHandler(missingPersonController.findOneMissingPerson)
);
