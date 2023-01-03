import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

interface NodeMailerInterface {
  to: string;
  subject: string;
  text: string;
}

export const nodeMailer = async (option: NodeMailerInterface) => {
  const smtpTransport = nodemailer.createTransport({
    service: 'Naver',
    host: 'smtp.naver.com',
    auth: {
      user: process.env.SMTPID,
      pass: process.env.SMTPPW,
    },
    port: 465,
    tls: {
      rejectUnauthorized: false,
    },
  });

  const result = await smtpTransport.sendMail({
    from: `missing<${process.env.SMTPID}>`,
    ...option,
  });
  return result;
};
