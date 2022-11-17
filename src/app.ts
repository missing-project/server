import express from 'express';
import cors from 'cors';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import logger from 'morgan';
import cron from 'node-cron';
import { dbService } from './services';
import { port, mongoDBUri } from './config';
import { errorHandler, loginRequired } from './middlewares';
import { indexRouter, userRouter } from './models/schemas';
import { endPoint } from './constants';

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

// app.use(endPoint.db, dbRouter);
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});

cron.schedule('* * * * *', async (params: any) => {
  await dbService.getCase();
});
