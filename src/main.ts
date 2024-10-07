import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './shared/pipes/all-exceptions.filter';
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

  // Utilizar el puerto proporcionado por el entorno o usar 3000 por defecto
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server running on port: ${port}`);
}

bootstrap();
