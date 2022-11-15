import { Model } from 'mongoose';
import { UserInterface, userModel } from '../models';

// 비즈니스 로직은 여기서!!
class UserService {
  private User: Model<UserInterface>;

  // 의존성 주입
  constructor(userModel: Model<UserInterface>) {
    this.User = userModel;
  }

  async findUsers() {
    return await this.User.find({});
  }
}

const userService = new UserService(userModel);

export { userService };
