import { caseModel, caseModelType } from '../models';
import { CaseInterface, CaseArrayInterface } from '../models/schemas/case';
import axios from 'axios';
import { logger } from '../winston';
import { openApiUri, apiImg, apiUrl } from '../config';
import { parseDate } from './components/utils';
class Api {
  private Case: caseModelType;

  constructor(caseModel: caseModelType) {
    this.Case = caseModel;
  }
  async createNewCase() {
    await this.Case.deleteMany({});
    return await this.getCase();
  }
  async getCase() {
    try {
      const { data } = await axios.get(openApiUri, {
        headers: {
          Accept: 'application/json',
        },
      });
      const cases: CaseInterface[] = data.list.map((obj: any) => {
        const num = obj.msspsnIdntfccd ? obj.msspsnIdntfccd : '';
        obj['occrDate'] = parseDate(obj.occrde);
        obj['img'] = apiImg + num;
        obj['url'] = apiUrl + num;
        return obj;
      });
      const newCase: CaseArrayInterface = {
        cases: cases,
      };

      return await this.createCase(newCase);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error('error message: ', error.message);
        return error.message;
      } else {
        logger.error('unexpected error: ', error);
        return 'An unexpected error occurred';
      }
    }
  }

  async createCase(data: CaseArrayInterface) {
    const newCase = await this.Case.insertMany(data.cases);
    return newCase;
  }
}

const api = new Api(caseModel);

export { api };
