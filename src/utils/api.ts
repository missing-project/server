import { caseModel, caseModelType } from '../models';
import { CaseInterface, CaseArrayInterface } from '../models/schemas/case';
import axios from 'axios';
import { logger } from '../winston';
import { openApiUri, apiImg, apiUrl } from '../config';
import { parseDate } from './components/utils';
import crypto from 'crypto';

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

  async setObj(obj: any): Promise<CaseInterface> {
    const num = obj.msspsnIdntfccd ? obj.msspsnIdntfccd : '';
    obj['occrDate'] = parseDate(obj.occrde);
    obj['img'] = apiImg + num;
    obj['url'] = apiUrl + num;
    const shasum = crypto.createHash('sha512');
    const nm: string = obj.nm;
    shasum.update(nm);
    const output: string = shasum.digest('base64').substring(0, 10);
    obj['key'] = output;
    obj['nm'] = nm;
    return new Promise((resolve, reject) => {
      resolve(obj);
      reject(new Error('fail setObj'));
    });
  }

  async getCaseByPage(page: number) {
    try {
      const uri = openApiUri + page;
      const { data } = await axios.get(uri, {
        headers: {
          Accept: 'application/json',
        },
      });

      const cases: CaseInterface[] = await Promise.all(
        data.list.map((obj: CaseInterface) => {
          return this.getLocation(obj);
        })
      );

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

  async getLocation(obj: CaseInterface): Promise<CaseInterface> {
    try {
      const addr = obj.occrAdres;
      const { data }: any = await axios.get(
        'https://dapi.kakao.com/v2/local/search/address.json?query=' + addr,
        {
          headers: {
            Authorization: 'KakaoAK 374020cdfd14863313f1b1f4e65bf889',
            Host: 'dapi.kakao.com',
          },
        }
      );
      if (data.documents.length > 0) {
        const x: number = data.documents[0].x;
        const y: number = data.documents[0].y;
        const object: CaseInterface = await this.setObj(obj);
        object.x = x;
        object.y = y;
        return new Promise((resolve, reject) => {
          resolve(object);
          reject(new Error('fail getLocation'));
        });
      }
    } catch (e) {
      logger.error('fail geaLocation', e);
    }
  }

  async createCase(data: CaseArrayInterface) {
    return await this.Case.insertMany(data.cases);
  }
}

const api = new Api(caseModel);

export { api };
