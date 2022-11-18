import { Model, model } from 'mongoose';
import { UserSchema, UserInterface } from './schemas/user';
import { CaseSchema, CaseInterface } from './schemas/case';
import { MissingPersonSchema, MissingPersonInterface } from './schemas/missingPerson';

interface ModelIdentifierInterface {
  user: string;
  case: string;
}

export const modelIdentifier: ModelIdentifierInterface = {
  user: 'user',
  case: 'case',
};

const userModel = model<UserInterface>(modelIdentifier.user, UserSchema);
const caseModel = model<CaseInterface>(modelIdentifier.case, CaseSchema);
const missingPersonModel = model<MissingPersonInterface>(modelIdentifier.case, MissingPersonSchema);

type userModelType = Model<UserInterface>;
type caseModelType = Model<CaseInterface>;
type missingPersonModelType = Model<MissingPersonInterface>;

// 이런 식으로 아래로 붙여주시고 아래 export 추가해주세요
export { 
  userModel, 
  userModelType, 
  caseModel, 
  caseModelType,
  missingPersonModel, 
  missingPersonModelType
};
