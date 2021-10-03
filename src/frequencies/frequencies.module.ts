import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Frequency } from './frequency.entity';
import { FrequenciesService } from './frequencies.service';
import { FrequenciesController } from './frequencies.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Frequency])],
  controllers: [FrequenciesController],
  providers: [FrequenciesService],
  exports: [FrequenciesService],
})
export class FrequenciesModule {}
