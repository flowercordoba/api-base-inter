import { Request, Response, NextFunction } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { InterbankModule } from 'src/features/integrations/interbank/interbank.module';

export class InterbankDocumentation {

  // Middleware de autenticación básica
  static basicAuth(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || '';
    const b64auth = authHeader.split(' ')[1] || '';
    const [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    if (!username || !password) {
      res.set('WWW-Authenticate', 'Basic realm="401"');
      return res.status(401).send('Authentication required.');
    }

    const fixedUsername = 'interback-admin'; 
    const fixedPassword = 'VDVkU0IM43Ae/5u5'; 
    if (username !== fixedUsername || password !== fixedPassword) {
      return res.status(401).send('Invalid username or password.');
    }

    next();
  }

  static setup(app: any) {
    const interbancoConfig = new DocumentBuilder()
      .setTitle('Interbanco API')
      .setDescription('Operations related to Interbank transactions.')
      .setVersion('1.0')
      .addTag('interbank')
      .addServer('https://sandbox.tupay.finance', 'Staging')
      .addServer('https://api.tupay.finance', 'PROD')
      .build();

    const interbancoDocument = SwaggerModule.createDocument(app, interbancoConfig, {
      include: [InterbankModule],
    });

    // Aplicamos el middleware de autenticación en la misma ruta de Swagger
    app.use('/api/doc/interbank', InterbankDocumentation.basicAuth);

    // Configuración de Swagger para la ruta de documentación
    SwaggerModule.setup('api/doc/interbank', app, interbancoDocument);
  }
}
