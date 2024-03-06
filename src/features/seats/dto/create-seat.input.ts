import { SeatStatus } from '@/enums/seat-status.enum';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateSeatInput {
  @Field(() => String)
  eventId: string;

  @Field(() => String, { nullable: true })
  zone: string;

  @Field(() => String)
  row: string;

  @Field(() => Int)
  seatNumber: number;

  @Field(() => SeatStatus, {
    defaultValue: SeatStatus.Available,
  })
  status: SeatStatus;
}
