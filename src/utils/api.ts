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

  async createNewCase(page: number) {
    try {
      await this.deleteCase();
      await this.case(page);
    } catch (e) {
      logger.error(e);
    }
  }

  async case(page: number): Promise<any> {
    const getSize = (await this.getCaseByPage(page)).length;
    if (getSize === 100) {
      return await this.case(page + 1);
    } else {
      return;
    }
  }

  async deleteCase() {
    try {
      return await this.Case.deleteMany({});
    } catch (e) {
      logger.error('fail deleteCase', e);
    }
  }

  async getCaseByPage(page: number) {
    try {
      const uri = openApiUri + page;
      const { data } = await axios.get(uri, {
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
    return await this.Case.insertMany(data.cases);
  }
}

const api = new Api(caseModel);

export { api };
