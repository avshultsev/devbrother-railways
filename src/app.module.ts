import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StationsModule } from './stations/stations.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
