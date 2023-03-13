import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { Connection } from 'amqplib';
import {
  ClientProxy,
  EventPattern,
  RmqRecordBuilder,
} from '@nestjs/microservices';
import { EmailService } from './email.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject('RABBITMQ_CONNECTION') private client: ClientProxy,
    @Inject(EmailService) private readonly emailService: EmailService,
  ) {}

  @EventPattern('create_user')
  async create(createUserDto: CreateUserDto) {
    const user = new this.userModel(createUserDto);
    await user.save();

    const record = new RmqRecordBuilder(JSON.stringify(user))
      .setOptions({
        headers: {
          ['x-version']: '1.0.0',
        },
        priority: 1,
      })
      .build();

    this.client.send('create-user', record);
    // Send fake email
    await this.emailService.sendEmail(
      user.email,
      'Welcome to my app',
      `Hi ${user.name}, thank you for joining my app!`,
    );

    return user;
  }

  findAll() {
    return this.userModel.find();
  }

  findOne(email: string) {
    return this.userModel.find({ email });
  }

  // findOneAndUpdateAvatar(id: string) {
  //   return this.userModel.findByIdAndUpdate(
  //     {
  //       _id: id,
  //     },
  //     {
  //       $set: {
  //         avatar:
  //       },
  //     },
  //     {
  //       new: true,
  //     },
  //   );
  // }

  remove(id: string) {
    return this.userModel.deleteOne({ _id: id }).exec();
  }
}
