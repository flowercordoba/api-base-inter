import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './shared/pipes/all-exceptions.filter';
import { envs } from './shared/config';
import { InterbankDocumentation } from './shared/modules/documentation/documentation.interbank.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Establecer prefijo global para las rutas de la API
  app.setGlobalPrefix('api/v1');

  // Usar un pipe de validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Usar un filtro global de excepciones
  app.useGlobalFilters(new AllExceptionsFilter());

  // Configurar CORS
  app.enableCors({
    origin: '*', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  InterbankDocumentation.setup(app);


  await app.listen(envs.PORT);
  console.log(`Server running on port: ${envs.PORT}`);
}

bootstrap();
