import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
import { Interbank, PaymentStatus } from './entities/interbank.entity';
import { PaymentProvider } from 'src/features/provider/entities/provider.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateSessionDto } from './dtos/create-session.dto';
// import { HttpService } from '@nestjs/axios';
// import { lastValueFrom } from 'rxjs';
// import { EmailService } from 'src/shared/modules/email/email.service';

@Injectable()
export class InterbankService {

    constructor(
        @InjectRepository(Interbank)
        private readonly paymentRepository: Repository<Interbank>,
        @InjectRepository(PaymentProvider)
        private readonly providerRepository: Repository<PaymentProvider>,
    ) { }



async createPaymentSession(dto: CreateSessionDto): Promise<string> {
  // Generar un UUID para el cliente
  const customerReference = uuidv4();

  // Buscar el proveedor seleccionado por su ID
  const provider = await this.providerRepository.findOne({ where: { id: dto.providerId } });
  if (!provider) {
    throw new Error('Proveedor no encontrado');
  }

  // Generar un ID de sesión único
  const sessionId = uuidv4();

  // Crear la entidad Interbank con la información inicial, incluyendo el UUID del cliente
  const newPaymentSession = this.paymentRepository.create({
    sessionId,
    invoiceReference: dto.invoiceReference,
    customerReference,  
    amount: dto.amount,
    provider: provider,  // Asociar el proveedor seleccionado
    numberAgreement: '1123',  // Número de convenio fijo
    status: PaymentStatus.PENDING,  // Estado inicial del pago
  });

  // Guardar la sesión de pago en la base de datos
  await this.paymentRepository.save(newPaymentSession);

  // Retornar el sessionId al cliente
  return sessionId;
}


    async getPaymentStatus(sessionId: string): Promise<string> {
        // Buscar la sesión de pago por su sessionId
        const paymentSession = await this.paymentRepository.findOne({ where: { sessionId } });

        // Si no se encuentra la sesión de pago, lanzar una excepción NotFound
        if (!paymentSession) {
            throw new NotFoundException('Sesión de pago no encontrada');
        }

        // Retornar el estado actual del pago
        return paymentSession.status;
    }


    
    
    async updatePaymentStatus(sessionId: string, newStatus: string, customerReference: string): Promise<void> {
        const paymentSession = await this.paymentRepository.findOne({ where: { sessionId } });
      
        if (!paymentSession) {
          throw new HttpException('Sesión de pago no encontrada', HttpStatus.NOT_FOUND);
        }
      
        // Actualizar el estado del pago basado en el status recibido
        switch (newStatus.toUpperCase()) {
          case 'SUCCESS':
            paymentSession.status = PaymentStatus.SUCCESS;
            await this.paymentRepository.save(paymentSession);
      
            // Enviar correo (puedes usar customerReference aquí si es necesario)
            console.log(`Notificando al cliente con referencia: ${customerReference}`);
            // Aquí puedes enviar el correo o hacer otras acciones con el customerReference
            break;
      
          case 'FAIL':
            paymentSession.status = PaymentStatus.FAIL;
            await this.paymentRepository.save(paymentSession);
            break;
      
          case 'PENDING':
            paymentSession.status = PaymentStatus.PENDING;
            await this.paymentRepository.save(paymentSession);
            break;
      
          default:
            throw new HttpException('Estado del pago no válido', HttpStatus.BAD_REQUEST);
        }
      }
      

    async processPayment(sessionId: string): Promise<{ status: string; message: string }> {
        console.log('Iniciando el procesamiento del pago para sessionId:', sessionId);
      
        // Buscar la sesión de pago por el sessionId
        const paymentSession = await this.paymentRepository.findOne({
          where: { sessionId },
          relations: ['provider'],
        });
      
        if (!paymentSession) {
          throw new NotFoundException('Sesión de pago no encontrada');
        }
      
        console.log('Sesión de pago encontrada:', paymentSession);
      
        // Usar el customerReference (UUID) como referencia del cliente para futuros procesos
        const customerReference = paymentSession.customerReference;
      
        // Si el estado ya es SUCCESS, no se cambia, pero se envía el correo
        if (paymentSession.status === PaymentStatus.SUCCESS) {
          console.log('El pago ya fue procesado correctamente anteriormente. Enviando correo...');
      
          // Enviar correo (usando el UUID o la información del cliente que tengas disponible)
          try {
            await this.updatePaymentStatus(sessionId, PaymentStatus.SUCCESS, customerReference);
          } catch (error) {
            console.error('Error al enviar el correo para sessionId:', sessionId, error.message);
            throw new HttpException('Error durante el envío del correo', HttpStatus.INTERNAL_SERVER_ERROR);
          }
      
          return {
            status: PaymentStatus.SUCCESS,
            message: 'El pago ya fue procesado correctamente anteriormente',
          };
        }
      
        // Verificar si el estado es FAIL o PENDING, para cambiarlo a SUCCESS
        if (paymentSession.status === PaymentStatus.FAIL || paymentSession.status === PaymentStatus.PENDING) {
          try {
            paymentSession.status = PaymentStatus.SUCCESS;
      
            // Guardar el estado actualizado en la base de datos
            await this.paymentRepository.save(paymentSession);
            console.log('Estado de pago actualizado a SUCCESS para sessionId:', sessionId);
      
            // Llamar a updatePaymentStatus cuando el estado sea SUCCESS
            await this.updatePaymentStatus(sessionId, PaymentStatus.SUCCESS, customerReference);
      
            return {
              status: PaymentStatus.SUCCESS,
              message: 'Pago procesado correctamente',
            };
          } catch (error) {
            console.error('Error durante el procesamiento del pago para sessionId:', sessionId, error.message);
            throw new HttpException('Error durante el procesamiento del pago', HttpStatus.INTERNAL_SERVER_ERROR);
          }
        }
      
        // Retornar mensaje de que el pago está en un estado no procesable (opcional)
        return {
          status: paymentSession.status,
          message: `El pago no puede ser procesado porque ya tiene el estado ${paymentSession.status}`,
        };
      }
      
      
    // llamada a la api de interbank

    // async processPayment(sessionId: string): Promise<{ status: string; message: string }> {
    //     // Buscar la sesión de pago por el sessionId
    //     const paymentSession = await this.paymentRepository.findOne({
    //       where: { sessionId },
    //       relations: ['provider'],
    //     });

    //     if (!paymentSession) {
    //       throw new NotFoundException('Sesión de pago no encontrada');
    //     }

    //     // Verificar si el pago ya fue procesado
    //     if (paymentSession.status !== PaymentStatus.PENDING) {
    //       throw new BadRequestException('El pago ya fue procesado');
    //     }

    //     // Llamada a la API del proveedor real
    //     try {
    //       const providerUrl = paymentSession.provider.webhookUrl; // Suponiendo que el URL del proveedor está en webhookUrl
    //       const paymentData = {
    //         amount: paymentSession.amount,
    //         invoiceReference: paymentSession.invoiceReference,
    //         customerReference: paymentSession.customerReference,
    //       };

    //       // Llamada a la API del proveedor usando HttpService
    //       const response = await lastValueFrom(
    //         this.httpService.post(`${providerUrl}/process-payment`, paymentData)
    //       );

    //       const paymentResult = response.data.status; // Suponiendo que el proveedor devuelve un estado SUCCESS o FAIL

    //       // Actualizar el estado del pago basado en la respuesta del proveedor
    //       paymentSession.status = paymentResult === 'SUCCESS' ? PaymentStatus.SUCCESS : PaymentStatus.FAIL;

    //       // Guardar el estado actualizado en la base de datos
    //       await this.paymentRepository.save(paymentSession);

    //       // Retornar el estado del pago al cliente
    //       return {
    //         status: paymentResult,
    //         message: paymentResult === 'SUCCESS' ? 'Pago procesado correctamente' : 'El pago ha fallado',
    //       };
    //     } catch (error) {
    //       throw new HttpException('Error durante el procesamiento del pago con el proveedor', HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }

}
