import { caseModel, caseModelType } from '../models';
import { CaseInterface, CaseArrayInterface } from '../models/schemas/case';
import axios from 'axios';
import { logger } from '../winston';
import { openApiUri } from '../config';

class Api {
  private Case: caseModelType;

  constructor(caseModel: caseModelType) {
    this.Case = caseModel;
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
        obj[
          'img'
        ] = `https://www.safe182.go.kr/api/lcm/imgView.do?msspsnIdntfccd=${num}`;
        obj[
          'url'
        ] = `https://www.safe182.go.kr/home/lcm/lcmMssGet.do?gnbMenuCd=014000000000&lnbMenuCd=014001000000&rptDscd=2&msspsnIdntfccd=${num}`;
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
