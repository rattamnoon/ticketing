import { Field, ID, InputType } from '@nestjs/graphql';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserInput } from './create-user.input';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => ID)
  id: string;
}
