import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';

import { Event } from '@/database/entities/event.entity';

import { SeatsModule } from '../seats/seats.module';
import { EventResolver } from './event.resolver';
import { EventService } from './event.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    forwardRef(() => SeatsModule),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        ttl: config.get('REDIS_DEFAULT_TTL'),
        isGlobal: true,
        store: redisStore as unknown as CacheStore,
        host: config.get('REDIS_HOST'),
        port: config.get('REDIS_POST'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EventResolver, EventService],
  exports: [EventService],
})
export class EventModule {}
