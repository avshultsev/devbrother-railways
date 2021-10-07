import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { CarriagesController } from './carriages.controller';
import { CarriagesRepository } from './carriages.repository';
import { CarriagesService } from './carriages.service';

@Module({
  imports: [TypeOrmModule.forFeature([CarriagesRepository]), UsersModule],
  controllers: [CarriagesController],
  providers: [CarriagesService],
  exports: [CarriagesService],
})
export class CarriagesModule {}
