import { Schema } from 'mongoose';

export interface MissingPersonInterface {
    esntid: string; //고유아이디
    authKey: string; 
    writngTrgetDscds: [number]; //정상아동 010, 지적장애인 060, 치매질환자 070
    sexdstnDscd: boolean; //1, 2인데 이렇게 해도 될지?
    nm: string; //name
    detailDate1: Date;
    detailDate2: Date;
    age1: number;
    age2: number;
    file2: string; //사진
    etcSpfeatr: string; //신체특징
    occrAdres: string; //발생장소
}

export const MissingPersonSchema = new Schema<MissingPersonInterface>(
    {
    esntid: {
        type: String,
        required: true,
    },
    authKey: {
        type: String,
        required: true,
    },
    writngTrgetDscds: {
        type: [Number],
        required: true,
    },
    sexdstnDscd: {
        type: Boolean,
        required: true,
    },
    nm: {
        type: String,
        required: true,
    },
    detailDate1: {
        type: Date,
        required: true,
    },
    detailDate2: {
        type: Date,
        required: true,
    },
    age1: {
        type: Number,
        required: true,
    },
    age2: {
        type: Number,
        required: true,
    },
    file2: {
        type: String,
        required: true,
    },
    etcSpfeatr: {
        type: String,
        required: true,
    },
    occrAdres: {
        type: String,
        required: true,
    },
    },
    {
    timestamps: true,
    }
);
