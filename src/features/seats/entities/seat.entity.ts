import { SeatStatus } from '@/enums/seat-status.enum';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Seat {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  eventId: string;

  @Field(() => String, { nullable: true })
  zone: string;

  @Field(() => String)
  row: string;

  @Field(() => SeatStatus, {
    defaultValue: SeatStatus.Available,
  })
  status: string;
}
