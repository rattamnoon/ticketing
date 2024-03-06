import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { groupBy } from 'lodash';
import { In, Repository } from 'typeorm';

import { Reservation } from '@/database/entities/reservation.entity';

import { ReservationStatus } from '@/enums/reservation-status.enum';
import { SeatsService } from '../seats/seats.service';
import { CreateReservationInput } from './dto/create-reservation.input';
import { UpdateReservationInput } from './dto/update-reservation.input';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private seatsService: SeatsService,
  ) {}

  async create(
    createReservationInput: CreateReservationInput,
    userId: string,
  ): Promise<Reservation> {
    // validate the seat and event are available
    await this.seatsService.validate(createReservationInput.seatId);

    const reservation = new Reservation();

    reservation.userId = userId;
    reservation.seatId = createReservationInput.seatId;

    const result = await this.reservationRepository.save(reservation);

    await this.seatsService.reserved(result.seatId);

    return result;
  }

  async findAll(): Promise<Reservation[]> {
    return await this.reservationRepository.find();
  }

  async findOne(id: string) {
    const reservation = await this.reservationRepository.findOneBy({ id });

    if (!reservation) {
      throw new Error('Reservation not found');
    }

    return reservation;
  }

  async update(
    id: string,
    updateReservationInput: UpdateReservationInput,
    userId: string,
  ): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOneBy({ id });

    if (!reservation) {
      throw new Error('Reservation not found');
    }

    reservation.userId = userId;
    reservation.seatId = updateReservationInput.seatId;
    reservation.status = updateReservationInput.status;

    const result = await this.reservationRepository.save(reservation);

    // if the reservation is canceled, make the seat available
    if (result.status === ReservationStatus.Canceled) {
      await this.seatsService.available(result.seatId);
    }

    return result;
  }

  async remove(id: string): Promise<boolean> {
    const reservation = await this.reservationRepository.findOneBy({ id });
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    const result = await this.reservationRepository.softDelete({ id });

    return !!result.affected;
  }

  async getReservationsByBatchSeatId(
    ids: Array<string>,
  ): Promise<Reservation[][]> {
    const seats = await this.reservationRepository.find({
      where: { seatId: In(ids) },
    });

    const group = groupBy(seats, (seat) => seat.seatId);

    return ids.map((id) => group[id]);
  }

  async getReservationsByBatchUserId(
    ids: Array<string>,
  ): Promise<Reservation[][]> {
    const seats = await this.reservationRepository.find({
      where: { userId: In(ids) },
    });

    const group = groupBy(seats, (seat) => seat.userId);

    return ids.map((id) => group[id]);
  }
}
