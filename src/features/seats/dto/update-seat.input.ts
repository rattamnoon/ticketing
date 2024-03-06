import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateSeatInput } from './create-seat.input';

@InputType()
export class UpdateSeatInput extends PartialType(CreateSeatInput) {
  @Field(() => ID, { nullable: true })
  id: string;
}
