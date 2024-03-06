import { Seat } from '@/database/entities/seat.entity';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventModule } from '../event/event.module';
import { SeatsResolver } from './seats.resolver';
import { SeatsService } from './seats.service';

@Module({
  imports: [TypeOrmModule.forFeature([Seat]), forwardRef(() => EventModule)],
  providers: [SeatsResolver, SeatsService],
  exports: [SeatsService],
})
export class SeatsModule {}
