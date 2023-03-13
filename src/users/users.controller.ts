import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import axios from 'axios';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const { email, name, password } = createUserDto;
    const { data } = await axios.post('https://reqres.in/api/users', {
      email,
      name,
      password,
    });

    await this.usersService.create(createUserDto);

    return data;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const { data } = await axios.get(`https://reqres.in/api/users/${id}`);
    return data.data;
  }

  @Get(':id/avatar')
  async findOneAndUpdateAvatar(@Param('id') id: string) {
    const { data } = await axios.get(`https://reqres.in/api/users/${id}`);
    const url = data.data.avatar;

    const savedUser = this.usersService.findOne(data.data.email);

    // if (!(await savedUser).avatar) {
    //   const response = await axios.get(url, { responseType: 'arraybuffer' });
    //   const buffer = Buffer.from(response.data, 'binary');
    // }

    return savedUser;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
