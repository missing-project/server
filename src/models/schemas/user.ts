import { Schema } from 'mongoose';

export interface LoginInterface {
  uid: string;
  password: string;
}

export interface UserInterface {
  uid: string;
  email: string;
  password: string;
  name: string;
  refreshToken?: string;
  device: string;
  role: string;
  active: boolean;
}

export const UserSchema = new Schema<UserInterface>(
  {
    uid: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: false,
    },
    device: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    active: {
      type: Schema.Types.Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
