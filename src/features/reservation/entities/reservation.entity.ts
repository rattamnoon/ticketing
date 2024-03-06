import { ReservationStatus } from '@/enums/reservation-status.enum';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Reservation {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  userId: string;

  @Field(() => String)
  seatId: string;

  @Field(() => ReservationStatus)
  status: ReservationStatus;
}
