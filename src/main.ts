import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { PORT } from './common/constant/app.constant';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ResponseSuccessInterceptor } from './common/interceptors/response-success.interceptor';
import { ProtectGuard } from './common/guard/protect/protect.guard';
import { PermissionGuard } from './common/guard/permission/permission.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true }
  }));

  const reflector = app.get(Reflector)
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new ResponseSuccessInterceptor(reflector));
  app.useGlobalGuards(new ProtectGuard(reflector));
  // app.useGlobalGuards(new PermissionGuard(reflector));

  // SWAGGER 
  const config = new DocumentBuilder()
    .setTitle('Capstone Nestjs (Movie API)')
    .setDescription('Developed by Ngo Thanh Hien')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true
    }
  });

  const logger = new Logger("Bootstrap")
  await app.listen(PORT ?? 3000, () => {
    logger.log(`Server is running on http://localhost:${PORT}`)
  });
}
bootstrap();
