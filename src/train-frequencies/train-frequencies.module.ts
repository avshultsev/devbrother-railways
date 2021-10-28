import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FrequenciesModule } from '../frequencies/frequencies.module';
import { TrainFrequenciesController } from './train-frequencies.controller';
import { TrainFrequenciesService } from './train-frequencies.service';
import { TrainFrequency } from './train-frequency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrainFrequency]), FrequenciesModule],
  controllers: [TrainFrequenciesController],
  providers: [TrainFrequenciesService],
  exports: [TrainFrequenciesService],
})
export class TrainFrequenciesModule {}
