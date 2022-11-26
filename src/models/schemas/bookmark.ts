import { Schema } from 'mongoose';

export interface BookmarkInterface {
    key: string;
    uid: string;
}

export const BookmarkSchema = new Schema<BookmarkInterface>(
  {
    key: {
      type: Schema.Types.String,
      ref: 'case',
      required: true,
    },
    uid: {
        type: Schema.Types.String,
        ref: 'user',
        required: true
    },
  },
  {
    timestamps: true,
  }
);
