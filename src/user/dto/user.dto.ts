// import { ThreadDto } from 'src/thread/dto';
// import { CommentDto } from 'src/comment/dto';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  id: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  hashedPassword: string;

  @IsString()
  pfp: string;

  @IsString()
  bio: string;

  // threads: ThreadDto[];  //don't forget to update the user controller, when to get data
  // coments: CommentDto[];
  localization: string;
}
