import { Router } from 'express';
import { caseController } from '../controller';
import { asyncHandler } from '../utils';

export const caseRouter = Router();

caseRouter.get('/', asyncHandler(caseController.getCaselist));
caseRouter.get('/:caseId', asyncHandler(caseController.getCasedetail));
