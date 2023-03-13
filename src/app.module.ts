import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    // username and password passed to easy demostration, just for that database
    MongooseModule.forRoot(
      'mongodb+srv://testDataUser:testPassword@development.7knus.mongodb.net/test',
    ),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
