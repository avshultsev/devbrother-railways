import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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

@Module({
  imports: [
    AuthModule,
    StationsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'nest-railways',
      autoLoadEntities: true,
      synchronize: true, // should not be set in production, see: https://docs.nestjs.com/techniques/database#typeorm-integration
    }),
    UsersModule,
    RoutesModule,
    RouteDetailsModule,
    TrainsModule,
    CarriagesModule,
    SeatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
