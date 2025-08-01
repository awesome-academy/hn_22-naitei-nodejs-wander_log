import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { MailsModule } from 'src/mails/mails.module';

@Module({
  imports: [
    PrismaModule,
    MailsModule,
    PassportModule, 
    JwtModule.register({
      secret: process.env.JWT_SECRET, 
      signOptions: { expiresIn: '7d' }, 
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
