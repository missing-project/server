import dotenv from 'dotenv';
import { logger } from './winston';
const envFound = dotenv.config();

if (envFound.error) {
  throw new Error("Couldn't find .env file");
}

if (process.env.MONGODB_URI === undefined) {
  throw new Error(
    '어플리케이션을 시작하려면 MONGODB_URI 환경변수가 필요합니다.'
  );
}
if (process.env.OPEN_API === undefined) {
  logger.error('api uri없음');
}

const port = parseInt(process.env.PORT ?? '8080', 10);
const mongoDBUri = process.env.MONGODB_URI;
const OPEN_API_URI: string = process.env.OPEN_API;
const API_IMG: string = process.env.API_IMG;
const API_URL: string = process.env.API_URL;
const KAKAO_MAP: string = process.env.KAKAO_MAP;
const KAKAO_AUTH: string = process.env.KAKAO_AUTH;
const KAKAO_HOST: string = process.env.KAKAO_HOST;
export {
  port,
  mongoDBUri,
  OPEN_API_URI,
  API_IMG,
  API_URL,
  KAKAO_MAP,
  KAKAO_AUTH,
  KAKAO_HOST,
};
