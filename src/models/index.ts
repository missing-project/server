import { Model, model } from 'mongoose';
import { UserSchema, UserInterface } from './schemas/user';
import { CaseSchema, CaseInterface } from './schemas/case';
import { BookmarkSchema, BookmarkInterface } from './schemas/bookmark';

interface ModelIdentifierInterface {
  user: string;
  case: string;
  bookmark: string;
}

export const modelIdentifier: ModelIdentifierInterface = {
  user: 'user',
  case: 'case',
  bookmark: 'bookmark',
};

const userModel = model<UserInterface>(modelIdentifier.user, UserSchema);
const caseModel = model<CaseInterface>(modelIdentifier.case, CaseSchema);
const bookmarkModel = model<BookmarkInterface>(modelIdentifier.bookmark, BookmarkSchema);
// const caseModel = model<CaseInterface>(modelIdentifier.case, CaseSchema);

type userModelType = Model<UserInterface>;
type caseModelType = Model<CaseInterface>;
type bookmarkModelType = Model<BookmarkInterface>;

// 이런 식으로 아래로 붙여주시고 아래 export 추가해주세요
export { 
  userModel, 
  userModelType, 
  caseModel, 
  caseModelType,
  bookmarkModel,
  bookmarkModelType,
};
