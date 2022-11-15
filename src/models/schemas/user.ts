import { Schema } from 'mongoose';

export interface UserInterface {
  email: string;
  password: string;
}

export const UserSchema = new Schema<UserInterface>(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
