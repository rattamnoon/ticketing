import { Field, Int, ObjectType } from '@nestjs/graphql';
import 'reflect-metadata';
import { User } from './user.entity';

@ObjectType()
export class Login {
  @Field(() => User)
  user: User;

  @Field()
  token: string;

  @Field(() => Int)
  tokenExpires: number;
}
