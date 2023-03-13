import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Connection } from 'amqplib';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:admin@localhost:5672'],
        queue: 'users_queue',
        queueOptions: {
          durable: false,
        },
      },
    });

  await microservice.listen();
  await app.listen(3000);
}
bootstrap();
