import express from 'express';
import cors from 'cors';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import Logger from 'morgan';
import { logger } from './winston';

import { port, mongoDBUri } from './config';
import { errorHandler} from './middlewares'; //loginRequired는 추후에 다시 연결예정
import { indexRouter, userRouter, guestRouter} from './routers';
import { endPoint } from './constants';
import { api } from './utils';
import cron from 'node-cron';

const app = express();

mongoose.connect(mongoDBUri);
mongoose.connection.on('connected', () => {
  logger.info(`Successfully connected to MongoDB: ${mongoDBUri}`);
});

app.use(cors());
app.use(Logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get(endPoint.index, indexRouter);
// app.use(endPoint.user, loginRequired, userRouter);
app.use(endPoint.user,  userRouter);
app.use(endPoint.guest, guestRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server listening on port: ${port}`);
});

cron.schedule('0 0 12 * * *', async () => {
  await api.getCase();
});
