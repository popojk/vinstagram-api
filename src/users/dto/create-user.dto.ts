import { IsNotEmpty } from 'class-validator';

export class CreateUserInput {

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

}