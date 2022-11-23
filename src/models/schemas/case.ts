import { Schema } from 'mongoose';

export interface CaseInterface {
  nm: string;
  age?: number;
  ageNow?: number;
  accrde?: Date;
  alldressingDscd?: string;
  writngTrgetDscd?: number;
  sexdstnDscd?: string;
  occrAdres?: string;
  img?: string;
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
      type: Number,
    },
    sexdstnDscd: {
      type: String,
    },
    occrAdres: {
      type: String,
    },
    img: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: 'case',
  }
);
// todo sexdstnDscd, writngTrgetDscd enum
