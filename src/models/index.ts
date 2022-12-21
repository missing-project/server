import { Model, model } from 'mongoose';
import { UserSchema, UserInterface } from './schemas/user';
import { CaseSchema, CaseInterface } from './schemas/case';
import { BookmarkSchema, BookmarkInterface } from './schemas/bookmark';
import { NoticeInterface, NoticeSchema } from './schemas/notice';

interface ModelIdentifierInterface {
  user: string;
  case: string;
  bookmark: string;
  notice: string;
  appinfo: string;
}

export const modelIdentifier: ModelIdentifierInterface = {
  user: 'user',
  case: 'case',
  bookmark: 'bookmark',
  notice: 'notice',
  appinfo: 'appinfo',
};

const userModel = model<UserInterface>(modelIdentifier.user, UserSchema);
const caseModel = model<CaseInterface>(modelIdentifier.case, CaseSchema);
const bookmarkModel = model<BookmarkInterface>(
  modelIdentifier.bookmark,
  BookmarkSchema
);
const noticeModel = model<NoticeInterface>(
  modelIdentifier.notice,
  NoticeSchema
);

type userModelType = Model<UserInterface>;
type caseModelType = Model<CaseInterface>;
type bookmarkModelType = Model<BookmarkInterface>;
type noticeModelType = Model<NoticeInterface>;

// 이런 식으로 아래로 붙여주시고 아래 export 추가해주세요
export {
  userModel,
  userModelType,
  caseModel,
  caseModelType,
  bookmarkModel,
  bookmarkModelType,
  noticeModel,
  noticeModelType,
};
