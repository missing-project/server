import { Request, Response, NextFunction } from 'express';

export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next?: NextFunction
) => Promise<any>;

export type ErrorType = 'FORBIDDEN' | 'NOTFOUND' | 'SERVERERROR' | 'BADREQUEST';

export enum CaseDesc {
  '010' = '정상아동(18세미만)',
  '020' = '가출인',
  '040' = '시설보호무연고자',
  '060' = '지적장애인',
  '061' = '지적장애인(18세미만)',
  '062' = '지적장애인(18세이상)',
  '070' = '치매질환자',
  '080' = '불상(기타)',
}
