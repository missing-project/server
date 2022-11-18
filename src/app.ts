/* 파일 전체에 no-console 룰 사용 안함, 파일 최상단에 선언 */
/* eslint-disable no-console */

import express from 'express';
import cors from 'cors';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import logger from 'morgan';

import { port, mongoDBUri } from './config';
import { errorHandler, loginRequired } from './middlewares';
import { indexRouter, userRouter } from './routers';
import { endPoint } from './constants';
import { dbService } from './services';
import cron from 'node-cron';

const app = express();

mongoose.connect(mongoDBUri);
mongoose.connection.on('connected', () => {
  console.log(`Successfully connected to MongoDB: ${mongoDBUri}`);
});

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get(endPoint.index, indexRouter);
app.use(endPoint.user, loginRequired, userRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(errorHandler);

app.listen(port, () => {
  logger(`Server listening on port: ${port}`);
});

cron.schedule('10 * * * * *', async () => {
  await dbService.getCase();
});
