import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReservationStatus } from '../../enums/reservation-status.enum';
import { Seat } from './seat.entity';
import { User } from './user.entity';

@Entity('reservation')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.Booking,
  })
  status: ReservationStatus;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, (user) => user.reservations, {
    orphanedRowAction: 'soft-delete',
  })
  @JoinColumn({ name: 'userId' })
  user: Event;

  @Column('uuid')
  seatId: string;

  @ManyToOne(() => Seat, (user) => user.reservations, {
    orphanedRowAction: 'soft-delete',
  })
  @JoinColumn({ name: 'seatId' })
  seat: Event;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
