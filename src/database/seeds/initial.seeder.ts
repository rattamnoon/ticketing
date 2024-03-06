import * as argon2 from 'argon2';
import dayjs from 'dayjs';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { EventStatus } from '../../enums/event-status.enum';
import { Event } from '../entities/event.entity';
import { Seat } from '../entities/seat.entity';
import { User } from '../entities/user.entity';

export default class InitialSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    console.log(`Start seeding ...`);

    console.log(`Seeding user ...`);
    const password = await argon2.hash(process.env.GOD_PASSWORD!);
    const admin = new User();
    admin.email = 'rattamnoon.kir@gmail.com';
    admin.firstname = 'rattamnoon';
    admin.lastname = 'kiratipisut';
    admin.password = password;
    await dataSource.manager.save(admin);
    console.log(`Seeding user complete`);

    console.log(`Seeding events ...`);
    const zones = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const events = Array.from({ length: 1 }).map((_, i) => {
      const event = new Event();
      event.name = `Event ${i + 1}`;
      event.description = `Description of event ${i + 1}`;
      event.date = dayjs().add(i, 'month').toDate();

      if (i % 2 === 0) {
        event.status = EventStatus.Close;
      }

      event.seats = Array.from({ length: 10 }).map((_, j) => {
        const seat = new Seat();
        seat.zone = zones[j % 10];
        seat.row = seat.zone + ((j % 26) + 1);
        seat.seatNumber = j + 1;
        // seat.status = j % 2 === 0 ? SeatStatus.Available : SeatStatus.Reserved;
        seat.event = event;
        return seat;
      });

      event.totalSeats = event.seats.length;

      return event;
    });
    await dataSource.manager.save(events);
    console.log(`Seeding events complete`);

    console.log('Complete seeding !!');
  }
}
