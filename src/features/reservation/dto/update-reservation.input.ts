import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateReservationInput } from './create-reservation.input';

@InputType()
export class UpdateReservationInput extends PartialType(
  CreateReservationInput,
) {
  @Field(() => ID)
  id: string;
}
