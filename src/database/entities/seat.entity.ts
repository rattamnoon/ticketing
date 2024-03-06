import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SeatStatus } from '../../enums/seat-status.enum';
import { Event } from './event.entity';
import { Reservation } from './reservation.entity';

@Entity('seat')
export class Seat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  eventId: string;

  @ManyToOne(() => Event, (event) => event.seats, {
    orphanedRowAction: 'soft-delete',
  })
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @Column({ nullable: true })
  zone: string;

  @Column()
  row: string;

  @Column()
  seatNumber: number;

  @Column({
    type: 'enum',
    enum: SeatStatus,
    default: SeatStatus.Available,
  })
  status: SeatStatus;

  @OneToMany(() => Reservation, (reservation) => reservation.seat, {
    cascade: true,
    nullable: true,
  })
  reservations: Array<Reservation>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
