import { caseService } from '../services';
import { AsyncRequestHandler } from '../types';

interface caseControllerInterface {
  getCaselist: AsyncRequestHandler;
  getCasedetail: AsyncRequestHandler;
}

/* 
컨트롤러에서는 비즈니스로직을 작성하지 마시오!
req, res 활용하여 client와의 상호작용만을 다루는 레이어 입니다.
*/

export const caseController: caseControllerInterface = {
  async getCaselist(req, res) {
    const caselist = await caseService.findCaselist();
    res.json(caselist);
  },

  async getCasedetail(req, res) {
    const { caseId } = req.params;
    const casedetail = await caseService.findCasedetail(caseId);
    res.json(casedetail);
  },
};
