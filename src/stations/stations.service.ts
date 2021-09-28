import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStationDto } from './dto/create-station.dto';
import { Station } from './stations.entity';
import { StationsRepository } from './stations.repository';

@Injectable()
export class StationsService {
  constructor(private stationsRepository: StationsRepository) {}

  getAllStations(): Promise<Station[]> {
    return this.stationsRepository.find();
  }

  getStationsWithFilter(title: string): Promise<Station[]> {
    return this.stationsRepository.findWithFilter(title);
  }

  async getStationById(id: string): Promise<Station> {
    const station = await this.stationsRepository.findOne(id);
    if (!station)
      throw new NotFoundException(`Station with "${id}" id not found!`);
    return station;
  }

  getStationByName(title: string) {
    return this.stationsRepository.findOne({ where: { title } });
  }

  async createStation(station: CreateStationDto): Promise<Station> {
    const newStation = this.stationsRepository.create(station);
    await this.stationsRepository.save(newStation);
    return newStation;
  }

  async deleteStation(id: string): Promise<void> {
    const { affected } = await this.stationsRepository.delete(id);
    if (!affected)
      throw new NotFoundException(`Station with "${id}" id not found!`);
  }
}
