import express from 'express';
import cors from 'cors';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import Logger from 'morgan';
import { logger } from './winston';

import { port, mongoDBUri } from './config';
import { errorHandler, loginRequired } from './middlewares';
import { indexRouter, userRouter } from './routers';
import { endPoint } from './constants';
import { dbService } from './services';
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
app.use(endPoint.user, loginRequired, userRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server listening on port: ${port}`);
});

cron.schedule('10 * * * * *', async () => {
  await dbService.getCase();
});
