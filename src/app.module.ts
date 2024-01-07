import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
// Importando variables de entorno
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// Mis Módulos...
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  constructor(){}
}
