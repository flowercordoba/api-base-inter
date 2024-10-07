// import { LoggerService, Injectable } from '@nestjs/common';
// import * as winston from 'winston';
// import { esTransport } from '../modules/elastisc/winston-elasticsearch-transport';

// @Injectable()
// export class CustomLoggerService implements LoggerService {
//   private logger: winston.Logger;

//   constructor() {
//     this.logger = winston.createLogger({
//       transports: [
//         new winston.transports.Console({
//           format: winston.format.combine(
//             winston.format.timestamp(),
//             winston.format.simple(),
//           ),
//         }),
//         esTransport, // Agrega el transporte de Elasticsearch
//       ],
//     });
//   }

//   log(message: string) {
//     this.logger.info(message);
//   }

//   error(message: string, trace: string) {
//     this.logger.error(message, { trace });
//   }

//   warn(message: string) {
//     this.logger.warn(message);
//   }

//   debug(message: string) {
//     this.logger.debug(message);
//   }

//   verbose(message: string) {
//     this.logger.verbose(message);
//   }
// }
