import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventStatus } from '../../enums/event-status.enum';
import { Seat } from './seat.entity';

@Entity('event')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    nullable: true,
  })
  date: Date;

  @Column('int')
  totalSeats: number;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.Open,
  })
  status: EventStatus;

  @OneToMany(() => Seat, (seat) => seat.event, {
    cascade: true,
  })
  seats: Array<Seat>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
