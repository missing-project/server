import { model } from 'mongoose';
import UserSchema, { UserInterface } from './schemas/users';

interface ModelInterface {
  [key: string]: string;
}

const modelIdentifier: ModelInterface = {
  user: 'user',
  post: 'post',
};

const userModel = model<UserInterface>(modelIdentifier.user, UserSchema);
// const postModel = model<PostInterface>(modelIdentifier.post, PostSchema);
// 이런 식으로 아래로 붙여주시고 아래 export 추가해주세요

export { modelIdentifier, userModel, UserInterface };
