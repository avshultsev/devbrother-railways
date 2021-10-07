import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { CarriagesController } from './carriages.controller';
import { Carriage } from './carriages.entity';
import { CarriagesService } from './carriages.service';

@Module({
  imports: [TypeOrmModule.forFeature([Carriage]), UsersModule],
  controllers: [CarriagesController],
  providers: [CarriagesService],
  exports: [CarriagesService],
})
export class CarriagesModule {}
