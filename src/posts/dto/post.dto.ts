import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  
  @IsNotEmpty()
  readonly text: string;
  
}