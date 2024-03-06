import { EventStatus } from '@/enums/event-status.enum';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Event {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => Date, { nullable: true })
  date: Date;

  @Field(() => Int, { nullable: true })
  totalSeats: number;

  @Field(() => EventStatus, { defaultValue: EventStatus.Open })
  status: EventStatus;
}
