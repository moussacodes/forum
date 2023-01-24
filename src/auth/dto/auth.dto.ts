import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

//made basic stuff, we may change some things later
export class SignupDto {
  @IsString()
  @IsNotEmpty()
  username;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  hashedPassword: string;

  @IsOptional()
  @IsString()
  pfp: string;

  @IsString()
  @IsOptional()
  bio: string;
}

export class SigninDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  hashedPassword: string;
}
