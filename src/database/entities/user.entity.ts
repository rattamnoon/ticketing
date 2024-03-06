import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Reservation } from './reservation.entity';

@Entity('user')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({
    nullable: true,
  })
  firstname?: string;

  @Column({
    nullable: true,
  })
  lastname?: string;

  @Column()
  password: string;

  @OneToMany(() => Reservation, (reservation) => reservation.user, {
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
