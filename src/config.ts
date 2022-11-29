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
const openApiUri: string = process.env.OPEN_API;
const apiImg: string = process.env.API_IMG;
const apiUrl: string = process.env.API_URL;
export { port, mongoDBUri, openApiUri, apiImg, apiUrl };
