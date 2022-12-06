import { Schema } from 'mongoose';

export interface BookmarkInterface {
  uid: Schema.Types.String;
  key: string;
}

export const BookmarkSchema = new Schema<BookmarkInterface>(
  {
    uid: { type: Schema.Types.String, ref: 'user', required: true },
    key: {
      type: Schema.Types.String,
      ref: 'case',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
