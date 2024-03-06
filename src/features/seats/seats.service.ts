import { Seat } from '@/database/entities/seat.entity';
import { EventStatus } from '@/enums/event-status.enum';
import { SeatStatus } from '@/enums/seat-status.enum';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { groupBy, keyBy } from 'lodash';
import { FindManyOptions, In, Repository } from 'typeorm';
import { EventService } from '../event/event.service';
import { CreateSeatInput } from './dto/create-seat.input';
import { UpdateSeatInput } from './dto/update-seat.input';

@Injectable()
export class SeatsService {
  constructor(
    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,
    private eventService: EventService,
  ) {}

  async create(createSeatInput: CreateSeatInput): Promise<Seat> {
    const seat = new Seat();

    seat.eventId = createSeatInput.eventId;
    seat.zone = createSeatInput.zone;
    seat.row = createSeatInput.row;
    seat.seatNumber = createSeatInput.seatNumber;
    seat.status = createSeatInput.status;

    return await this.seatRepository.save(seat);
  }

  async findAll(options?: FindManyOptions<Seat>): Promise<Seat[]> {
    return await this.seatRepository.find(options);
  }

  async findOne(id: string) {
    const seat = await this.seatRepository.findOne({
      where: { id },
      relations: ['event'],
    });

    if (!seat) {
      throw new Error('Seat not found');
    }
    return seat;
  }

  async update(id: string, updateSeatInput: UpdateSeatInput): Promise<Seat> {
    const seat = await this.seatRepository.findOneBy({ id });

    if (!seat) {
      throw new Error('Seat not found');
    }

    seat.zone = updateSeatInput.zone;
    seat.row = updateSeatInput.row;
    seat.seatNumber = updateSeatInput.seatNumber;
    seat.status = updateSeatInput.status;

    return await this.seatRepository.save(seat);
  }

  async reserved(seatId: string): Promise<Seat> {
    const seats = await this.seatRepository.findOneBy({
      id: seatId,
    });

    seats.status = SeatStatus.Reserved;

    return await this.seatRepository.save(seats);
  }

  async available(seatId: string): Promise<Seat> {
    const seats = await this.seatRepository.findOneBy({
      id: seatId,
    });

    seats.status = SeatStatus.Available;

    return await this.seatRepository.save(seats);
  }

  async remove(id: string): Promise<boolean> {
    const seat = await this.seatRepository.findOneBy({ id });
    if (!seat) {
      throw new Error('Seat not found');
    }

    const result = await this.seatRepository.softDelete({ id });

    return !!result.affected;
  }

  async validate(id: string): Promise<boolean> {
    const seat = await this.findOne(id);

    if (!seat) {
      throw new Error('Seat not found');
    }

    // Check event is valid
    await this.eventService.validate(seat.eventId);

    // Check event is closed
    if (seat.event.status === EventStatus.Close) {
      throw new Error('Event is closed');
    }

    // Check seat is available
    if (seat.status !== SeatStatus.Available) {
      throw new Error('Seat is not available');
    }

    return true;
  }

  async getSeatsByBatch(ids: Array<string>): Promise<Seat[][]> {
    const seats = await this.seatRepository.find({
      where: { event: In(ids) },
    });

    const group = groupBy(seats, (seat) => seat.eventId);

    return ids.map((id) => group[id]);
  }

  async getSeatByBatch(ids: Array<string>): Promise<Seat[]> {
    const seats = await this.seatRepository.find({
      where: { id: In(ids) },
    });

    const group = keyBy(seats, (seat) => seat.id);

    return ids.map((id) => group[id]);
  }
}
