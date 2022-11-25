import { Schema } from 'mongoose';

export interface CaseInterface {
  nm: string;
  age?: number;
  ageNow?: number;
  accrde?: Date;
  alldressingDscd?: string;
  writngTrgetDscd?: string;
  sexdstnDscd?: string;
  occrAdres?: string;
  img?: string;
  url?: string;
}
export interface CaseArrayInterface {
  cases: CaseInterface[];
}
export const CaseSchema = new Schema<CaseInterface>(
  {
    nm: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    ageNow: {
      type: Number,
    },
    accrde: {
      type: Date,
    },
    alldressingDscd: {
      type: String,
    },
    writngTrgetDscd: {
      type: String,
    },
    sexdstnDscd: {
      type: String,
      enum: ['남자', '여자'],
    },
    occrAdres: {
      type: String,
    },
    img: {
      type: String,
      required: false,
    },
    url: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: 'cases',
  }
);
// todo sexdstnDscd, writngTrgetDscd enum
