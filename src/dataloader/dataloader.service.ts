import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';

import { Reservation } from '@/features/reservation/entities/reservation.entity';
import { ReservationService } from '@/features/reservation/reservation.service';
import { Seat } from '@/features/seats/entities/seat.entity';
import { SeatsService } from '@/features/seats/seats.service';
import { User } from '@/features/user/entities/user.entity';
import { UserService } from '@/features/user/user.service';
import { IDataloaders } from '@/types/dataloader';

@Injectable()
export class DataloaderService {
  constructor(
    private readonly userService: UserService,
    private readonly seatsService: SeatsService,
    private readonly reservationService: ReservationService,
  ) {}

  getLoaders(): IDataloaders {
    const userLoaders = new DataLoader<string, User>(
      async (ids: Array<string>) => {
        return await this.userService.getUserByBatch(ids);
      },
    );

    const seatsLoaders = new DataLoader<string, Seat[]>(
      async (ids: Array<string>) => {
        return await this.seatsService.getSeatsByBatch(ids);
      },
    );

    const seatLoaders = new DataLoader<string, Seat>(
      async (ids: Array<string>) => {
        return await this.seatsService.getSeatByBatch(ids);
      },
    );

    const reservationsByUserIdsLoaders = new DataLoader<string, Reservation[]>(
      async (ids: Array<string>) => {
        return await this.reservationService.getReservationsByBatchUserId(ids);
      },
    );

    const reservationsBySeatIdsLoaders = new DataLoader<string, Reservation[]>(
      async (ids: Array<string>) => {
        return await this.reservationService.getReservationsByBatchSeatId(ids);
      },
    );

    return {
      userLoaders,
      seatLoaders,
      seatsLoaders,
      reservationsByUserIdsLoaders,
      reservationsBySeatIdsLoaders,
    };
  }
}
