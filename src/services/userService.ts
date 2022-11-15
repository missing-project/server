import { userModel, userModelType } from '../models';
import { UserInterface } from '../models/schemas/user';

// 비즈니스 로직은 여기서!!
class UserService {
  private User: userModelType;

  // 의존성 주입
  constructor(userModel: userModelType) {
    this.User = userModel;
  }

  async findUser(uid: string) {
    return await this.User.find({ _id: uid });
  }

  async createUser(userInfo: UserInterface) {
    return await this.User.create(userInfo);
  }
}

const userService = new UserService(userModel);

export { userService };
