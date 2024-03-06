import { Reservation } from '@/database/entities/reservation.entity';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventModule } from '../event/event.module';
import { SeatsModule } from '../seats/seats.module';
import { ReservationResolver } from './reservation.resolver';
import { ReservationService } from './reservation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation]),
    forwardRef(() => EventModule),
    forwardRef(() => SeatsModule),
  ],
  providers: [ReservationResolver, ReservationService],
  exports: [ReservationService],
})
export class ReservationModule {}
