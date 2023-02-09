import axios from "axios";
import crypto from "crypto";

import { caseModel, caseModelType } from "../models";
import { CaseInterface, CaseArrayInterface } from "../models/schemas/case";
import { logger } from "../winston";
import {
  OPEN_API_URI,
  API_IMG,
  API_URL,
  KAKAO_MAP,
  KAKAO_AUTH,
  KAKAO_HOST,
} from "../config";
import { parseDate } from "./parsedate";

class Scheduler {
  private Case: caseModelType;

  constructor(caseModel: caseModelType) {
    this.Case = caseModel;
  }

  async createNewCase() {
    try {
      await this.deleteCase();
      await this.caselist();
    } catch (e) {
      logger.error(e);
    }
  }

  async caselist(page: number = 1): Promise<any> {
    try {
      const getSize = (await this.getCaseByPage(page)).length;
      if (getSize === 100) {
        return await this.caselist(page + 1);
      } else {
        return;
      }
    } catch (e) {
      logger.error(e);
    }
  }

  async deleteCase() {
    try {
      return await this.Case.deleteMany({});
    } catch (e) {
      logger.error("fail deleteCase", e);
    }
  }

  async setObj(obj: any): Promise<CaseInterface> {
    const num = obj.msspsnIdntfccd ? obj.msspsnIdntfccd : "";
    const shasum = crypto.createHash("sha512");
    const nm: string = obj.nm;
    shasum.update(`${nm}${num}`);
    const output: string = shasum.digest("base64").substring(0, 50);
    const { x, y }: CaseInterface = await this.getLocation(obj);

    obj.occrDate = parseDate(obj.occrde);
    obj.nm = nm;
    obj._id = output;
    obj.img = API_IMG + num;
    obj.url = API_URL + num;
    obj.x = x;
    obj.y = y;

    return new Promise((resolve, reject) => {
      resolve(obj);
      reject(new Error("fail setObj"));
    });
  }

  async getCaseByPage(page: number) {
    try {
      const uri = OPEN_API_URI + page;

      const { data } = await axios.get(uri, {
        headers: {
          Accept: "application/json",
        },
      });

      const cases: CaseInterface[] = await Promise.all(
        data.list.map((obj: CaseInterface) => {
          return this.setObj(obj);
        })
      );

      // const newCase: CaseArrayInterface = {
      //   cases: cases,
      // };

      return await this.createCase(cases);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error("error message: ", error.message);
        return error.message;
      } else {
        logger.error("unexpected error: ", error);
        return "An unexpected error occurred";
      }
    }
  }

  async getLocation(obj: CaseInterface): Promise<CaseInterface> {
    try {
      const addr = obj.occrAdres;
      const { data }: any = await axios.get(KAKAO_MAP + addr, {
        headers: {
          Authorization: KAKAO_AUTH,
          Host: KAKAO_HOST,
        },
      });
      if (data.documents.length > 0) {
        const x: number = data.documents[0].x;
        const y: number = data.documents[0].y;
        obj.x = x;
        obj.y = y;
      }
      return new Promise((resolve, reject) => {
        resolve(obj);
        reject(new Error("fail getLocation"));
      });
    } catch (e) {
      logger.error("fail geaLocation", e);
    }
  }

  async createCase(data: CaseInterface[]) {
    return await this.Case.insertMany(data);
  }
}

const scheduler = new Scheduler(caseModel);

export { scheduler };
