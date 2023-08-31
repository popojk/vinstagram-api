import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Response } from 'express';
import { User } from 'src/schemas/user.schema';

@Controller('users')
export class UsersController {

  constructor(private usersService: UsersService) {};

  @Get()
  async getAllUsers(@Res() res: Response) {
    const users = await this.usersService.findAllUsers();
    console.log(users);
    res.send(users);
  }

  @Get(':id')
  async getUser(
    @Param('id') id: string,
    @Res() res: Response){
      const user = await this.usersService.findUser(id);
      res.send(user);
  }
  
  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response) {
    const createdUser = await this.usersService.createUser(createUserDto)
    res.send(createdUser);
  }
}
