import { EventModule } from '@/features/event/event.module';
import { ReservationModule } from '@/features/reservation/reservation.module';
import { SeatsModule } from '@/features/seats/seats.module';
import { UserModule } from '@/features/user/user.module';
import { Module, forwardRef } from '@nestjs/common';
import { DataloaderService } from './dataloader.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => EventModule),
    forwardRef(() => SeatsModule),
    forwardRef(() => ReservationModule),
  ],
  providers: [DataloaderService],
  exports: [DataloaderService],
})
export class DataloaderModule {}
