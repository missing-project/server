import { userModel, userModelType } from '../models';
import { UserInterface, LoginInterface } from '../models/schemas/user';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

// 비즈니스 로직은 여기서!!
class UserService {
  private User: userModelType;

  // 의존성 주입
  constructor(userModel: userModelType) {
    this.User = userModel;
  }

  async findUser(uid: string) {
    return await this.User.find({ uid });
  }

  async createUser(userInfo: UserInterface) {
    const { uid, email, password, name, device } = userInfo;

    const userEmailValidation = await this.User.findOne({ email: email });
    if (userEmailValidation) {
      throw new Error('이 이메일은 사용중입니다. 다른 이메일을 입력해 주세요');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const registerInfo = {
      uid,
      email,
      password: hashedPassword,
      name,
      device,
      role: 'user',
      active: true,
    };
    return await this.User.create(registerInfo);
  }

  async deleteUser(uid: string) {
    return await this.User.remove({ uid });
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

    // 토큰 생성
    const secretKey = 'dfdffdf';
    const accessPayload = {
      uid: user.uid,
      role: user.role,
      device: user.device,
    };
    const refreshPayload = { device: user.role };

    const accessToken = jwt.sign(accessPayload, secretKey, { expiresIn: '1h' });
    const refreshToken = jwt.sign(refreshPayload, secretKey, {
      expiresIn: '14d',
    });

    //DB에 refresh token 저장

    const loginUser = await this.User.findOneAndUpdate(
      { uid: user.uid },
      { refreshToken: refreshToken },
      { returnOriginal: false }
    );
    return { loginUser, accessToken, refreshToken };
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

  async updateUser(userInfo: UserInterface) {
    userInfo;
    return await this.User.deleteOne({});
  }

  // 액세스 토큰 만료에 따른 재생산
  async expandToken(uid: string, refreshToken: string) {
    const user = await this.User.findOne({ uid });
    if (refreshToken === user?.refreshToken) {
      const secretKey = process.env.JWT_SECRETKEY;
      const accessPayload = {
        uid: user.uid,
        role: user.role,
        device: user.role,
      };

      const accessToken = jwt.sign(accessPayload, secretKey, {
        expiresIn: '1h',
      });
      return accessToken;
    }
    return;
  }
}

const userService = new UserService(userModel);

export { userService };
