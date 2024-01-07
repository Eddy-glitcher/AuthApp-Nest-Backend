import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  // Habilitamos las peticiones de cualquier sitio...

  // Añadimos este pipe para validar la información que se espera, si en la peticion llega información no esperada o que falta, se responderá con un error...
  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    })
  );

  await app.listen(3000);


}
bootstrap();
