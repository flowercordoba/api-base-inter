import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;


    constructor() {
        // Configura el transportador con las credenciales del servicio de correo (por ejemplo, Gmail, SMTP, etc.)
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'flowermoreno7@gmail.com',
                pass: 'xuagyvzcjbpqplwf',
            },
        });
    }

    
  // Método para enviar correos
  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions = {
      from: 'flowermoreno7@gmail.com', // Remitente autorizado
      to,
      subject,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Correo enviado con éxito.');
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw new Error('No se pudo enviar el correo.');
    }
  }


    // Método para enviar un correo con adjunto
    async sendMailWithAttachment(to: string, subject: string, html: string, attachmentPath: string): Promise<void> {
        const mailOptions = {
            from: '"Plataforma de Pagos" flowercordoba7@gmail.com', // Cambia por el remitente
            to, // Dirección de email del cliente
            subject, // Asunto del correo
            html, // Contenido HTML del correo
            attachments: [
                {
                    filename: 'Factura.pdf', // Nombre del archivo PDF adjunto
                    path: attachmentPath, // Ruta del archivo PDF generado
                },
            ],
        };

        await this.transporter.sendMail(mailOptions);
    }

}
