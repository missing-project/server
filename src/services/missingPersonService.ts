import { caseModel, caseModelType } from '../models';
import { CaseInterface } from '../models/schemas/case';
import { ObjectId } from 'mongodb';

// 비즈니스 로직은 여기서!!
class MissingPersonService {
  private MissingPerson: caseModelType;

  // 의존성 주입
  constructor(missingPersonModel: caseModelType) {
    this.MissingPerson = missingPersonModel;
  }
  //사건 등록
  async createMissingPerson(missingPersonInfo: CaseInterface) {
    return await this.MissingPerson.create(missingPersonInfo);
  }
  //모든 사건 get
  async findMissingPersons() {
    return await this.MissingPerson.find();
  }
  //특정(하나) 사건 get
  async findMissingPerson(caseId: string) {
    const person = await this.MissingPerson.findOne({
      _id: new ObjectId(caseId),
    });
    return person;
  }

  //사건 삭제
  async deleteMissingPerson(caseId: string) {
    return await this.MissingPerson.findOneAndDelete({
      _id: new ObjectId(caseId),
    });
  }
}

const missingPersonService = new MissingPersonService(caseModel);

export { missingPersonService };
