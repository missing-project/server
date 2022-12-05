import { caseModel, caseModelType } from '../models';
import { ObjectId } from 'mongodb';

// 비즈니스 로직은 여기서!!
class CaseService {
  private caseModel: caseModelType;

  // 의존성 주입
  constructor(caseModel: caseModelType) {
    this.caseModel = caseModel;
  }
  //모든 사건 get
  async findCaselist() {
    return await this.caseModel.find();
  }
  //특정(하나) 사건 get
  async findCasedetail(caseId: string) {
    const person = await this.caseModel.findOne({
      _id: new ObjectId(caseId),
    });
    return person;
  }

  async findCasedetailByKey(key: string) {
    return await this.caseModel.findOne({ key });
  }
}

const caseService = new CaseService(caseModel);

export { caseService };
