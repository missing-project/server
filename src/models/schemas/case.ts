import { Schema } from 'mongoose';

export interface CaseInterface {
  nm: string;
  age: number;
}

export const CaseSchema = new Schema<CaseInterface>(
  {
    nm: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
