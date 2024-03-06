import { EventStatus } from '@/enums/event-status.enum';
import { UpdateSeatInput } from '@/features/seats/dto/update-seat.input';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateEventInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => Date, { nullable: true })
  date: Date;

  @Field(() => Int)
  totalSeats: number;

  @Field(() => EventStatus, { nullable: true })
  status: EventStatus;

  @Field(() => [UpdateSeatInput])
  seats: UpdateSeatInput[];
}
