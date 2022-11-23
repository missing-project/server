import { Schema } from 'mongoose';

export interface BookmarkInterface {
    caseId: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
}

export const BookmarkSchema = new Schema<BookmarkInterface>(
  {
    caseId: {
      type: Schema.Types.String,
      ref: 'case',
      required: true,
    },
    createdAt: {
        type: Date,
        required: true,
      },
    updatedAt: {
        type: Date,
        required: true,
      },
    email: {
        type: Schema.Types.String,
        ref: 'user',
        required: true
    },
  },
  {
    timestamps: true,
  }
);
