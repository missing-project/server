import { Schema } from 'mongoose';

export interface AppinfoInterface {
  version: string;
  appstore: string;
  playstore: string;
}

export const AppinfoSchema = new Schema<AppinfoInterface>(
  {
    version: { type: String, required: true },
    appstore: { type: String, required: true },
    playstore: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
