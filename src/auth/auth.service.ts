import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/users.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt.interface.payload';
import { LoginResponse } from './interfaces/login-response.interface';

import { 
  LogInDto,
  UpdateAuthDto,
  CreateUserDto,
  RegisterUserDto
} from './dto/index.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService
    ) {}

  async create(createUserDto: CreateUserDto): Promise<User>{
    // Creamos el nuevo usuario
    
    try {
      // 1- Encriptar la contraseña
      const {password, ...userData} = createUserDto; 
      
      const newUser = new this.userModel(
        {
          password : bcryptjs.hashSync(password, 10),
          ...userData
        }
      )
      
      // 2- Guardar el usuario

      await newUser.save();      
      const {password:_, ...user} = newUser.toJSON();
      
      // TODO: Generar el JWT

      return user;

    } catch (error) {
      console.log(error.code);

      if(error.code === 11000){
        throw new BadRequestException(`${createUserDto.email} alredy exists`);
      }

      throw new InternalServerErrorException('Something terrible happen!!');

    }

  }

  async register(registerDto: RegisterUserDto): Promise<LoginResponse>{
    
    // Creamos el usuario.
    const user = await this.create(registerDto);

    // Retornamos el Usuario y Generamos el jwt. 
    return {
      user,
      token : this.getJWT({id : user._id})
    };
  }

  async logIn(logInDto :LogInDto): Promise<LoginResponse>{

    try {
      const { email , password } = logInDto;

      const user = await this.userModel.findOne({email});

      if(!user) throw new UnauthorizedException('Not valid credentials -email');

      // Comparar contraseñas
      const validPassword = bcryptjs.compareSync(password, user.password);
      
      if(!validPassword) throw new UnauthorizedException('Not valid credentials -pass');

      const { password:_, ...userData } = user.toJSON();
      
      return {
        user: userData,
        token: this.getJWT({id : user.id})
      };

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }

  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  async findUserById(id : string): Promise<User>{
    const user = await this.userModel.findById(id);
    // Lo pasamos por el método toJSON() para asegurarnos que no nos mande los métodos que puedan ser enviados desde mongoose
    const { password:_, ...userData } = user.toJSON();
  
    return userData;
  }

  getJWT(payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }

  // findOne(id: number) {
  //   return `Loggeado correctamente!`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }



}
