import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports : [
    // Variables de entorno
    ConfigModule.forRoot(),

    // Aquí van los esquemas que quiero exponerle al módulo
    MongooseModule.forFeature([
      {
        name : User.name,
        schema : UserSchema
      }
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SEED,
      signOptions: { expiresIn: '15d' },
      // Los buenos tokens deben de durar poco tiempo
    }),
  ]
})
export class AuthModule {}
