import dotenv from 'dotenv';

const envFound = dotenv.config();

if (envFound.error) {
  throw new Error("Couldn't find .env file");
}

if (process.env.MONGODB_URI === undefined) {
  throw new Error(
    '어플리케이션을 시작하려면 MONGODB_URI 환경변수가 필요합니다.'
  );
}

const port = parseInt(process.env.PORT ?? '8080', 10);
const mongoDBUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';

export { port, mongoDBUri };
