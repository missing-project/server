import { Schema } from 'mongoose';

export interface CaseInterface {
  _id?: string;
  nm?: string;
  age?: number;
  ageNow?: number;
  occrDate?: Date;
  alldressingDscd?: string;
  writngTrgetDscd?: string;
  sexdstnDscd?: string;
  occrAdres?: string;
  img?: string;
  url?: string;
  x?: number;
  y?: number;
}
export interface CaseArrayInterface {
  cases: CaseInterface[];
}
export const CaseSchema = new Schema<CaseInterface>(
  {
    _id: {
      type: String,
    },
    nm: {
      type: String,
    },
    age: {
      type: Number,
    },
    ageNow: {
      type: Number,
    },
    occrDate: {
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
    x: {
      type: Number,
    },
    y: {
      type: Number,
    },
  },
  {
    timestamps: true,
    collection: 'case',
  }
);
// todo sexdstnDscd, writngTrgetDscd enum
