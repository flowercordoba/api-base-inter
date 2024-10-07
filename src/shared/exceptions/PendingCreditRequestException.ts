import { BadRequestException } from '@nestjs/common';

export class PendingCreditRequestException extends BadRequestException {
  constructor() {
    super('You already have a pending credit request with this funding provider. Please wait for approval or rejection before submitting a new request.');
  }
}
