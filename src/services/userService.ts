import { userModel, userModelType } from '../models';
import { UserInterface, LoginInterface } from '../models/schemas/user';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import differenceInDays from 'date-fns/differenceInDays';
import { nodeMailer } from '../utils/nodeMailer';

dotenv.config();

// 비즈니스 로직은 여기서!!
class UserService {
  private User: userModelType;

  private tokenCreate = (
    isAccess: boolean,
    uid: string,
    role: string
  ): string => {
    const secretKey = process.env.JWT_SECRET_KEY;
    return jwt.sign(
      isAccess ? { uid, role } : { uid, role, date: new Date() },
      secretKey,
      {
        expiresIn: isAccess ? '1m' : '14d',
      }
    );
  };

  private refreshExpireCheck = (token: string): boolean => {
    const secretKey = process.env.JWT_SECRET_KEY;
    const refreshDecoded = jwt.verify(token, secretKey);
    const date = (<{ date: string }>refreshDecoded).date;
    const diff = differenceInDays(new Date(), new Date(date));
    return diff < 4;
  };

  // 의존성 주입
  constructor(userModel: userModelType) {
    this.User = userModel;
  }

  async createUser(userInfo: UserInterface) {
    const { uid, email, password } = userInfo;
    const userEmailValidation = await this.User.findOne({ email: email });
    if (userEmailValidation) {
      throw new Error(
        '이 이메일은 이미 사용 중입니다. 다른 이메일을 입력해주세요'
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const registerInfo = {
      uid,
      email,
      password: hashedPassword,
      role: 'user',
      active: true,
    };
    return await this.User.create(registerInfo);
  }

  //계정 로그인
  async loginUser(loginInfo: LoginInterface) {
    const { uid, password } = loginInfo;
    const user = await this.User.findOne({ uid });
    // 계정 가입 내역 확인
    if (!user) {
      throw new Error(
        '입력하신 ID의 가입 내역이 없습니다. 다시 한 번 입력해 주세요'
      );
    }

    // 비밀번호 일치 여부 확인
    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      password,
      correctPasswordHash
    );

    if (!isPasswordCorrect) {
      throw new Error('비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요');
    }

    const { role } = user;
    const accessToken = this.tokenCreate(true, uid, role);
    const refreshToken = this.tokenCreate(false, uid, role);

    //DB에 refresh token 저장
    const loginUser = await this.User.findOneAndUpdate(
      { uid: user.uid },
      {
        refreshToken: refreshToken,
        recentLogin: Date.now(),
      },
      { returnOriginal: false }
    );
    return { user: loginUser, accessToken, refreshToken };
  }

  // 계정 로그아웃
  async logoutUser(uid: string) {
    const filter = { uid };
    const option = { returnOriginal: false };
    return await this.User.findOneAndUpdate(
      filter,
      { $unset: { refreshToken: '' } },
      option
    );
  }

  // 인증메일 보내기
  async authEmail(email: string) {
    const generateRandom = (min: number = 111111, max: number = 999999) => {
      const ranNum = Math.floor(Math.random() * (max - min + 1)) + min;
      return ranNum;
    };

    const number = generateRandom();
    const mailOption = {
      to: email,
      subject: '[Missing]이메일 인증 요청',
      text: `다음 숫자 6자리를 이메일 인증 칸란에 기입해주시기 바랍니다: ${number}`,
    };

    const result = await nodeMailer(mailOption);
    return { result, code: number };
  }

  // 엑세스 토큰 재발급
  async expandAccToken(_refreshToken: string, isLogin: boolean) {
    const user = await this.User.findOne({ refreshToken: _refreshToken });
    if (!user) {
      throw new Error('해당하는 토큰에 유효한 사용자는 존재하지 않습니다');
    }

    if (_refreshToken !== user?.refreshToken) {
      throw new Error(
        'DB에 저장된 토큰과 일치하지 않습니다. 다시 로그인 해주세요'
      );
    }
    const { uid, role } = user;
    const accessToken = this.tokenCreate(true, uid, role);
    let refreshToken = _refreshToken;

    if (this.refreshExpireCheck(_refreshToken)) {
      refreshToken = this.tokenCreate(false, uid, role);
      await this.User.findOneAndUpdate(
        { uid },
        isLogin ? { refreshToken, recentLogin: Date.now() } : { refreshToken }
      );
    }

    return { user, accessToken, refreshToken };
  }

  //계정 활성화
  async activeUser(uid: string) {
    const filter = { uid };
    const option = { returnOriginal: false };
    return await this.User.findOneAndUpdate(filter, { active: true }, option);
  }

  // 계정 비활성화
  async inactiveUser(uid: string) {
    const filter = { uid };
    const option = { returnOriginal: false };
    return await this.User.findOneAndUpdate(filter, { active: false }, option);
  }

  async findUserByUid(uid: string) {
    return await this.User.findOne({ uid });
  }

  async findUserByEmail(email: string) {
    return await this.User.findOne({ email });
  }

  async findUser(userInfo: Partial<UserInterface>) {
    return await this.User.findOne(userInfo);
  }

  async updateUser(uid: string, userInfo: Partial<UserInterface>) {
    const hashedPassword = userInfo.password
      ? await bcrypt.hash(userInfo.password, 10)
      : null;
    const userInfoUpdated = {
      ...userInfo,
      ...(hashedPassword ? { password: hashedPassword } : {}),
    };
    return await this.User.findOneAndUpdate({ uid }, userInfoUpdated);
  }

  async deleteUser(uid: string) {
    return await this.User.remove({ uid });
  }

  async passwordEmail(email: string, password: string) {
    const mailOption = {
      to: email,
      subject: '[Missing]임시 비밀번호 발급',
      text: `다음 문자를 비밀번호로 사용하십시오: ${password}`,
    };
    const result = await nodeMailer(mailOption);
    return result;
  }
}

const userService = new UserService(userModel);

export { userService };
