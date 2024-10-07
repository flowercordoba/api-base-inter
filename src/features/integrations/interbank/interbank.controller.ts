import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InterbankService } from './interbank.service';
import { CreateSessionDto } from './dtos/create-session.dto';

@Controller('interbank')
export class InterbankController {
  constructor(private readonly interbankService: InterbankService) {}

  @Post('create-session')
  async createPaymentSession(
    @Body() createInterbankDto: CreateSessionDto,
  ): Promise<{ sessionId: string }> {
    const sessionId =
      await this.interbankService.createPaymentSession(createInterbankDto);
    return { sessionId };
  }

  // Método para procesar el pago con el sessionId
  @Post('process-payment/:sessionId')
  async processPayment(
    @Param('sessionId') sessionId: string,
  ): Promise<{ status: string; message: string }> {
    return await this.interbankService.processPayment(sessionId);
  }

  // Método para obtener el estado del pago usando el sessionId
  @Get('payment-status/:sessionId')
  async getPaymentStatus(
    @Param('sessionId') sessionId: string,
  ): Promise<{ status: string }> {
    const status = await this.interbankService.getPaymentStatus(sessionId);
    return { status };
  }
}
