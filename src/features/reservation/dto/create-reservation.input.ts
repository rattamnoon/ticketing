import { ReservationStatus } from '@/enums/reservation-status.enum';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateReservationInput {
  @Field(() => ReservationStatus, {
    defaultValue: ReservationStatus.Booking,
  })
  status: ReservationStatus;

  @Field(() => String)
  seatId: string;
}
