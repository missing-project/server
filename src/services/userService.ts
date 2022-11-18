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

  async deleteUser(uid: string){
    return await this.User.remove({_id:uid});
  }

  //계정 활성화
  async activeUser(uid: string){
    const filter = { _id: uid };
    const option = { returnOriginal: false };
    return await this.User.findOneAndUpdate(filter,{active:true},option);  
  }

  // 계정 비활성화
  async inactiveUser(uid: string){
    const filter = { _id: uid };
    const option = { returnOriginal: false };
    return await this.User.findOneAndUpdate(filter,{active:false},option);
  }


  async updateUser(userInfo : UserInterface){ 
    userInfo;
    return await this.User.deleteOne({});
  }

  async expireToken(uid:string, token : string){
    const filter = { _id: uid };
    const option = { returnOriginal: false };
    const update = {accessToken : token}
    // const updatedUser = await User.findOneAndUpdate(filter, update, option);
   return await this.User.findOneAndUpdate(filter, update, option)
  }

  async expandToken(uid: string, token : string){
    const filter = { _id: uid };
    const option = { returnOriginal: false };
    const update = {accessToken : token}
    // const updatedUser = await User.findOneAndUpdate(filter, update, option);

   const updatedUser = await this.User.findOneAndUpdate(filter, update, option)
   return updatedUser;
  }
}

const userService = new UserService(userModel);

export { userService };
