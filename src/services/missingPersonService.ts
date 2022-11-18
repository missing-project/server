import { missingPersonModel, missingPersonModelType } from '../models';
import { MissingPersonInterface } from '../models/schemas/missingPerson';

// 비즈니스 로직은 여기서!!
class MissingPersonService {
    private MissingPerson: missingPersonModelType;

  // 의존성 주입
    constructor(missingPersonModel: missingPersonModelType) {
    this.MissingPerson = missingPersonModel;
    }
    //사건 등록
    async createMissingPerson(missingPersonInfo :MissingPersonInterface) {
      return await this.MissingPerson.create(missingPersonInfo);
    }
    //모든 사건 get
    async findMissingPersons() {
      return await this.MissingPerson.find();
    }
}

const missingPersonService = new MissingPersonService(missingPersonModel);

export { missingPersonService };
