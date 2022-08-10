import {IsEmail, IsString} from "class-validator";

export class UserRegisterDto{
    @IsEmail({},{message: 'Entered email is unexpected'})
    email: string;

    @IsString({message: "Password is not entered"})
    password: string;

    @IsString({message: "Name is not entered"})
    name: string;
}