import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RouteDetailsModule } from './route-details/route-details.module';
import { RoutesModule } from './routes/routes.module';
import { StationsModule } from './stations/stations.module';
import { UsersModule } from './users/users.module';
import { TrainsModule } from './trains/trains.module';
import { CarriagesModule } from './carriages/carriages.module';
import { SeatsModule } from './seats/seats.module';
import { FrequenciesModule } from './frequencies/frequencies.module';
import { TrainFrequenciesModule } from './train-frequencies/train-frequencies.module';
import { TicketsModule } from './tickets/tickets.module';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    AuthModule,
    StationsModule,
    DbModule,
    UsersModule,
    RoutesModule,
    RouteDetailsModule,
    TrainsModule,
    CarriagesModule,
    SeatsModule,
    FrequenciesModule,
    TrainFrequenciesModule,
    TicketsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
