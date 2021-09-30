import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Frequency } from './frequency.entity';
import { FrequenciesService } from './frequencies.service';

@Module({
  imports: [TypeOrmModule.forFeature([Frequency])],
  providers: [FrequenciesService],
  exports: [FrequenciesService],
})
export class FrequenciesModule {}
