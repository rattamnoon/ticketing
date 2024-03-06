import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { DataloaderModule } from './dataloader/dataloader.module';
import { DataloaderService } from './dataloader/dataloader.service';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './features/auth/auth.module';
import { EventModule } from './features/event/event.module';
import { ReservationModule } from './features/reservation/reservation.module';
import { SeatsModule } from './features/seats/seats.module';
import { UserModule } from './features/user/user.module';

import 'reflect-metadata';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT')!),
        database: configService.get('DB_NAME'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        synchronize: false,
        logging: false,
        entities: [join(__dirname, '/database/entities/**/*{.ts,.js}')],
        migrations: [join(__dirname, '/database/migrations/**/*{.ts,.js}')],
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [DataloaderModule],
      useFactory: (dataloaderService: DataloaderService) => {
        return {
          autoSchemaFile: join(process.cwd(), 'schema.gql'),
          context: () => {
            return {
              loaders: dataloaderService.getLoaders(),
            };
          },
          subscriptions: {
            'graphql-ws': {
              path: '/graphql',
            },
            'subscriptions-transport-ws': {
              path: '/graphql',
            },
          },
        };
      },
      inject: [DataloaderService],
    }),
    AuthModule,
    UserModule,
    EventModule,
    SeatsModule,
    ReservationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
