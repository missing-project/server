import { userModel, userModelType } from '../models';
import { UserInterface, LoginInterface } from '../models/schemas/user';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import differenceInDays from 'date-fns/differenceInDays';

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
        expiresIn: isAccess ? '1h' : '14D',
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

  async findUser(uid: string) {
    return await this.User.findOne({ uid });
  }

  async createUser(userInfo: UserInterface) {
    const { uid, email, password } = userInfo;

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
    const generateRandom = (min: number = 111111, max: number = 999999) => {
      const ranNum = Math.floor(Math.random() * (max - min + 1)) + min;
      return ranNum;
    };

    const number = generateRandom();
    const mailOptions = {
      from: `missing<${process.env.SMTPID}>`,
      to: email,
      subject: '[Missing]이메일 인증 요청',
      text:
        '다음 숫자 6자리를 이메인 인증 칸란에 기입해주시기 바랍니다. : ' +
        number,
    };

    const result = await smtpTransport.sendMail(mailOptions);
    return { result, code: number };
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
          user: process.env.SMTPID, // 네이버이메일
          pass: process.env.SMTPPW, // 네이버비밀번호
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
