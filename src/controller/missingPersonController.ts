import { missingPersonService } from '../services';
import { AsyncRequestHandler } from '../types';

interface missingPersonControllerInterface {
    getMissingPersons: AsyncRequestHandler;
    postMissingPerson: AsyncRequestHandler;
    deleteOneMissingPerson: AsyncRequestHandler;
    findOneMissingPerson: AsyncRequestHandler;
}

/* 
컨트롤러에서는 비즈니스로직을 작성하지 마시오!
req, res 활용하여 client와의 상호작용만을 다루는 레이어 입니다.
*/

export const missingPersonController: missingPersonControllerInterface = {
    async postMissingPerson(req, res) {
        const missingPerson = await missingPersonService.createMissingPerson(req.body);
        res.json(missingPerson);
    },
    
    async getMissingPersons(req, res) {
        const MissingPersons = await missingPersonService.findMissingPersons();
        res.json(MissingPersons);
    },

    async deleteOneMissingPerson(req, res) {
        const { caseId } = req.params;
        const deleteOne = await missingPersonService.deleteMissingPerson(caseId);
        res.json(deleteOne);
    },

    async findOneMissingPerson(req, res) {
        const { caseId } = req.params;
        const findOne = await missingPersonService.findMissingPerson(caseId);
        res.json(findOne);
    }

};
