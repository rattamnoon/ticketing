import { Reservation } from '@/features/reservation/entities/reservation.entity';
import { Seat } from '@/features/seats/entities/seat.entity';
import { User } from '@/features/user/entities/user.entity';
import DataLoader from 'dataloader';

export interface IDataloaders {
  userLoaders: DataLoader<string, User>;
  seatLoaders: DataLoader<string, Seat>;
  seatsLoaders: DataLoader<string, Seat[]>;
  reservationsByUserIdsLoaders: DataLoader<string, Reservation[]>;
  reservationsBySeatIdsLoaders: DataLoader<string, Reservation[]>;
}
