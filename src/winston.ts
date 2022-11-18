// logger.ts
import winston, { transports, format } from 'winston';
interface TransformableInfo {
  level: string;
  message: string;
  [key: string]: any;
}
export const logger = winston.createLogger({
  transports: [
    new transports.Console({
      level: 'debug',
      format: format.combine(
        format.label({ label: '[my-server]' }),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.colorize(),
        format.printf(
          (info: TransformableInfo) =>
            `${info.timestamp} - ${info.level}: ${info.label} ${info.message}`
        )
      ),
    }),
  ],
});
