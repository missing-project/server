import { userModel, userModelType } from '../models';
import { UserInterface, LoginInterface } from '../models/schemas/user';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

dotenv.config();

// 비즈니스 로직은 여기서!!
class UserService {
  private User: userModelType;

  // 의존성 주입
  constructor(userModel: userModelType) {
    this.User = userModel;
  }

  async findUser(uid: string) {
    return await this.User.findOne({ uid });
  }

  async createUser(userInfo: UserInterface) {
    const { uid, email, password, device } = userInfo;

    // 이메일 인증 부분을 authEmail에서 처리해주고 있어서 register 부분에서 제거할 것인지 토의필요!

    const userEmailValidation = await this.User.findOne({ email: email });
    if (userEmailValidation) {
      throw new Error('이 이메일은 사용중입니다. 다른 이메일을 입력해 주세요');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const registerInfo = {
      uid,
      email,
      password: hashedPassword,
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
    const secretKey = process.env.JWT_SECRET_KEY;
    const accessPayload = {
      uid: user.uid,
      role: user.role,
      device: user.device,
    };
    const refreshPayload = {};

    const accessToken = jwt.sign(accessPayload, secretKey, { expiresIn: '1h' });
    const refreshToken = jwt.sign(refreshPayload, secretKey, {
      expiresIn: '14d',
    });

    //DB에 refresh token 저장

    const loginUser = await this.User.findOneAndUpdate(
      { uid: user.uid },
      {
        refreshToken: refreshToken,
        recentLogin: Date.now(),
      },

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
  async expandAccToken(uid: string, refreshToken: string) {

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

  async expandRefToken(uid: string, refreshToken: string) {
    const user = await this.User.findOne({ uid });
    if (refreshToken === user?.refreshToken) {
      const secretKey = process.env.JWT_SECRETKEY;
      const refreshPayload = {};
      const newToken = jwt.sign(refreshPayload, secretKey, {
        expiresIn: '14D',
      });
      try {
        await this.User.findOneAndUpdate(
          { uid: user.uid },
          {
            refreshToken: newToken,
          },
          { returnOriginal: false }
        );
      } catch (err) {
        throw new Error(' DB에 갱신한 토큰을 저장하는데 실패했습니다.');
      }
      return newToken;
    }
    return;
  }

  async authEmail(email: string) {
    const userEmailValidation = await this.User.findOne({ email: email });
    if (userEmailValidation) {
      throw new Error('이 이메일은 사용중입니다. 다른 이메일을 입력해 주세요');
    }

    const smtpTransport = nodemailer.createTransport({
      service: 'Naver',
      host: 'smtp.naver.com',
      auth: {
        user: process.env.SMTPID,
        pass: process.env.SMTPPW,
      },
      port: 465,
      tls: {
        rejectUnauthorized: false,
      },
    });
    const generateRandom = (min: number, max: number) => {
      const ranNum = Math.floor(Math.random() * (max - min + 1)) + min;
      return ranNum;
    };

    const number = generateRandom(111111, 999999);
    const mailOptions = {
      from: `missing<${process.env.SMTPID}>`,
      to: email,
      subject: '[Missing]이메일 인증 요청',
      text:
        '다음 숫자 6자리를 이메인 인증 칸란에 기입해주시기 바랍니다. : ' +
        number,
    };

    const result = await smtpTransport.sendMail(mailOptions);
    return result;
  }
  async resetPassword(uid: string, email: string) {
    const user = await this.User.findOne({ uid: uid, email: email });
    if (!user) {
      throw new Error('입력하신 정보의 계정은 존재하지 않습니다');
    } else {
      const authNum = Math.random().toString(36).substring(2, 11);
      const smtpTransport = nodemailer.createTransport({
        service: 'Naver',
        host: 'smtp.naver.com',
        auth: {
          user: process.env.SMTPID,
          pass: process.env.SMTPPW,
        },
        port: 465,
        tls: {
          rejectUnauthorized: false,
        },
      });

      const mailOptions = {
        from: `missing<${process.env.SMTPID}>`,
        to: email,
        subject: '[Missing] 비밀번호 초기화 안내 ',
        text:
          '요청하신대로 비밀번호를 초기화 하였습니다. 다음의 문자를 입력하셔서 로그인 하신 후 비밀번호를 변경해주시기 바랍니다 : ' +
          authNum,
      };

      try {
        await smtpTransport.sendMail(mailOptions);
      } catch (err) {
        throw new Error('비밀번호 초기화 메일전송에 실패하였습니다');
      }

      try {
        const password = await bcrypt.hash(authNum, 10);
        await this.User.findOneAndUpdate(
          { uid: user.uid },
          {
            password,
          },
          { returnOriginal: false }
        );
      } catch (err) {
        throw new Error('비밀번호 초기화 및 인증메일 전송에 실패하였습니다.');
      }
      return {
        status: 'OK',
        message: '비밀번호 초기화 후 메일전송을 완료하였습니다.',
      };
    }

  }
}

const userService = new UserService(userModel);

export { userService };
