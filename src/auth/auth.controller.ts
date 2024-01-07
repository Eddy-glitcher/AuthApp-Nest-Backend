import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

// Mis dtos
import { 
  CreateUserDto,
  UpdateAuthDto,
  LogInDto,
  RegisterUserDto
} from './dto/index.dto';
import { AuthGuard } from './guards/auth.guard';
import { User } from './entities/users.entity';
import { LoginResponse } from './interfaces/login-response.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }
  // Loggin
  @Post('/login')
  login(@Body() logInDto: LogInDto) {
    return this.authService.logIn(logInDto);
  }

  // Register
  @Post('/register')
  register(@Body() registerDto: RegisterUserDto) {
    return this.authService.register(registerDto);
  }

  // Obtener todos los usuarios
  @UseGuards( AuthGuard  )
  @Get()
  findAll(@Request() req: Request) {
    const user = req['user'];

    return user;

    // return this.authService.findAll();
  }

  @UseGuards( AuthGuard  )
  @Get('/check-token')
  checkToken(@Request() req: Request): LoginResponse {
    const user = req['user'] as User;
    return {
      user,
      token : this.authService.getJWT({id : user._id})
    }
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // delete(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
