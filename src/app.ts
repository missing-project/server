import express from 'express';
import cors from 'cors';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import Logger from 'morgan';
import { logger } from './winston';

import { port, mongoDBUri } from './config';
import { errorHandler, loginRequired } from './middlewares';
import {
  indexRouter,
  caseRouter,
  userRouter,
  bookmarkRouter,
  guestRouter,
} from './routers';
import { endPoint } from './constants';
import { scheduler } from './utils';
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
app.use(endPoint.guest, guestRouter);
app.use(endPoint.case, caseRouter);
app.use(endPoint.user, loginRequired, userRouter);
app.use(endPoint.bookmark, loginRequired, bookmarkRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server listening on port: ${port}`);
});

cron.schedule(
  '0 0 3 * * *',
  async () => {
    try {
      logger.info(`scheduler start on time: ${new Date()}`);
      await scheduler.createNewCase().then(() => {
        logger.info(`scheduler success on time: ${new Date()}`);
      });
    } catch (e) {
      logger.error(e);
    }
  },
  {
    scheduled: true,
    timezone: 'Asia/Seoul',
  }
);
