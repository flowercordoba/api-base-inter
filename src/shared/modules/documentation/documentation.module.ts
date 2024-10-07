import { Module } from '@nestjs/common';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiKeyService } from 'src/features/api-key/api-key.service';
import { InterbankModule } from 'src/features/integrations/interbank/interbank.module';

@Module({
  providers: [ApiKeyService],
})
export class DocumentationModule {
  static async setup(app: any) {
    const apiKeyService = app.get(ApiKeyService);

    // ------------ Interbanco Documentation ------------
    app.use('/api/doc/interbank', async (req, res, next) => {
      const authHeader = req.headers.authorization || '';
      const b64auth = authHeader.split(' ')[1] || '';
      const [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');

      if (!username || !password) {
        res.set('WWW-Authenticate', 'Basic realm="401"');
        return res.status(401).send('Authentication required.');
      }

      const fixedUsername = 'user-interback-doc';
      const fixedPassword = 'rQcS6hbsPorRmtAQ';
      if (username !== fixedUsername || password !== fixedPassword) {
        return res.status(401).send('Invalid username or password.');
      }

      next();
    });

    const interbancoConfig = new DocumentBuilder()
      .setTitle('Interbanco API')
      .setDescription('Operations related to Interbank transactions.')
      .setVersion('1.0')
      .addTag('interbanco')
      .addServer('https://sandbox.tupay.finance', 'Staging')
      .addServer('https://api.tupay.finance', 'Production')
      .build();

    const interbancoDocument = SwaggerModule.createDocument(app, interbancoConfig, {
      include: [InterbankModule],
    });
    SwaggerModule.setup('api/doc/interbank', app, interbancoDocument);

  }
}


