import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FrequenciesModule } from 'src/frequencies/frequencies.module';
import { TrainsModule } from 'src/trains/trains.module';
import { TrainFrequenciesController } from './train-frequencies.controller';
import { TrainFrequenciesService } from './train-frequencies.service';
import { TrainFrequency } from './train-frequency.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrainFrequency]),
    TrainsModule,
    FrequenciesModule,
  ],
  controllers: [TrainFrequenciesController],
  providers: [TrainFrequenciesService],
})
export class TrainFrequenciesModule {}
