import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StationsModule } from './stations/stations.module';
<<<<<<< HEAD
import { RoutesModule } from './routes/routes.module';
import { RouteDetailsModule } from './route-details/route-details.module';
=======
import { UsersModule } from './users/users.module';
>>>>>>> 2f1107b8579b50c8854a595c7ee8edf332b7605e

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
<<<<<<< HEAD
    RoutesModule,
    RouteDetailsModule,
=======
    UsersModule,
>>>>>>> 2f1107b8579b50c8854a595c7ee8edf332b7605e
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
