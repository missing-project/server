import { Schema } from 'mongoose';

export interface NoticeInterface {
  title: string;
  content: string;
}

export const NoticeSchema = new Schema<NoticeInterface>(
  {
    title: { type: String, required: true },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
