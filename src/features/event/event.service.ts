import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisStore } from 'cache-manager-redis-store';

import { Event } from '@/database/entities/event.entity';

import { Seat } from '@/database/entities/seat.entity';
import { EventStatus } from '@/enums/event-status.enum';
import { SeatStatus } from '@/enums/seat-status.enum';
import dayjs from 'dayjs';
import { compact } from 'lodash';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache & RedisStore,
  ) {}

  async createCache(key: string, data: Event[]): Promise<void> {
    await this.cacheManager.set(key, data);
  }

  async findAllCache(): Promise<Event[]> {
    return await this.cacheManager.get<Event[]>('events');
  }

  async updateCache(key: string, data: Event): Promise<void> {
    const cachedData = await this.cacheManager.get<Event[]>(key);

    if (!cachedData) {
      return;
    }

    const validate = cachedData.some((item) => item.id === data.id);

    if (!validate) {
      return await this.cacheManager.set(key, compact([...cachedData, data]));
    }

    const index = cachedData.findIndex((item) => item.id === data.id);

    cachedData[index] = data;

    return await this.cacheManager.set(key, cachedData);
  }

  async deleteCache(key: string, data: Event): Promise<void> {
    const cachedData = await this.cacheManager.get<Event[]>(key);

    if (!cachedData) {
      return;
    }

    const validate = cachedData.some((item) => item.id === data.id);

    if (!validate) {
      return;
    }

    const index = cachedData.findIndex((item) => item.id === data.id);

    cachedData.splice(index, 1);

    return await this.cacheManager.set(key, cachedData);
  }

  async create(input: CreateEventInput): Promise<Event> {
    const event = new Event();

    event.name = input.name;
    event.description = input.description;
    if (input.date) {
      event.date = dayjs(input.date).startOf('day').toDate();
    }
    event.status = input.status;
    event.totalSeats = input.totalSeats;

    if (input.seats) {
      const newSeats = input.seats.map((seat) => {
        const newSeat = new Seat();

        newSeat.zone = seat.zone;
        newSeat.row = seat.row;
        newSeat.seatNumber = seat.seatNumber;
        newSeat.status = seat.status;

        return newSeat;
      });

      event.seats = newSeats;
    }

    // update cache after create event
    await this.updateCache('events', event);

    return await this.eventRepository.save(event);
  }

  transformEvent(event: Event): Event {
    return {
      ...event,
      date: dayjs(event.date).isValid() ? null : dayjs(event.date).toDate(),
    };
  }

  async findAll(options?: FindManyOptions<Event>): Promise<Event[]> {
    const cachedData = await this.findAllCache();

    if (cachedData) {
      return cachedData.map((event) => this.transformEvent(event));
    }

    const events = await this.eventRepository.find(options);

    // create cache after create event
    await this.createCache('events', events);

    return events;
  }

  async opnedEvents(): Promise<Event[]> {
    const cachedData = await this.findAllCache();

    if (cachedData) {
      return cachedData
        .filter((event) => event.status === EventStatus.Open)
        .map((event) => this.transformEvent(event));
    }

    const events = await this.eventRepository.find({
      where: { status: EventStatus.Open },
    });

    // update cache after create event
    await this.createCache('events', events);

    return events;
  }

  async closedEvents(): Promise<Event[]> {
    const cachedData = await this.findAllCache();

    if (cachedData) {
      return cachedData
        .filter((event) => event.status === EventStatus.Close)
        .map((event) => this.transformEvent(event));
    }

    const events = await this.eventRepository.find({
      where: { status: EventStatus.Close },
    });

    // update cache after create event
    await this.createCache('events', events);

    return events;
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['seats'],
    });

    if (!event) {
      throw new Error('Event not found');
    }

    return event;
  }

  async update(id: string, input: UpdateEventInput): Promise<Event> {
    const event = await this.eventRepository.findOneBy({ id });

    if (!event) {
      throw new Error('Event not found');
    }

    event.name = input.name;
    event.description = input.description;
    if (input.date) {
      event.date = dayjs(input.date).startOf('day').toDate();
    }
    event.status = input.status;
    event.totalSeats = input.totalSeats;

    if (input.seats) {
      const newSeats = input.seats.map((seat) => {
        const newSeat = new Seat();

        if (seat.id) {
          newSeat.id = seat.id;
        }
        if (seat.eventId) {
          newSeat.eventId = seat.eventId;
        }
        newSeat.zone = seat.zone;
        newSeat.row = seat.row;
        newSeat.seatNumber = seat.seatNumber;
        newSeat.status = seat.status;

        return newSeat;
      });

      event.seats = newSeats;
    }

    const result = await this.eventRepository.save(event);

    // update cache after create event
    await this.updateCache('events', result);

    return result;
  }

  async remove(id: string) {
    const seat = await this.eventRepository.findOneBy({ id });

    if (!seat) {
      throw new Error('Seat not found');
    }

    // delete cache after delete event
    await this.deleteCache('events', seat);

    const result = await this.eventRepository.softDelete({ id });

    return !!result.affected;
  }

  async validate(id: string): Promise<boolean> {
    const event = await this.findOne(id);

    if (!event) {
      throw new Error('Event not found');
    }

    // Check event is closed
    if (event.status === EventStatus.Close) {
      throw new Error('Event is closed');
    }

    if (event.date < new Date()) {
      throw new Error('Event is expired');
    }

    if (
      event.seats.filter((seat) => seat.status === SeatStatus.Available)
        .length === 0
    ) {
      throw new Error('Event is full');
    }

    return true;
  }
}
