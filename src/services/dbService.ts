import { caseModel, caseModelType } from '../models';
import axios from 'axios';

import { CaseInterface } from '../models/schemas/case';

type Case = {
  nm: string;
  age: string;
};

// type GetCaseResponse = {
//   data: Case[];
// };

class DBService {
  private Case: caseModelType;

  // 의존성 주입
  constructor(caseModel: caseModelType) {
    this.Case = caseModel;
  }

  async getCase() {
    try {
      const { data } = await axios.get(
        'https://www.safe182.go.kr/api/lcm/findChildList.do?esntlId=10000500&authKey=7414e21853de46f7&rowSize=1',
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );

      console.log(JSON.stringify({ data }));
      const newCase: Case = { nm: data.list[0].nm, age: data.list[0].age };
      return await this.createCase(newCase);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('error message: ', error.message);
        return error.message;
      } else {
        console.log('unexpected error: ', error);
        return 'An unexpected error occurred';
      }
    }
  }

  async createCase(data: Case) {
    return await this.Case.create(data);
  }
}

const dbService = new DBService(caseModel);

export { dbService };
