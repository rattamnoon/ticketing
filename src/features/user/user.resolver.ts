import { CurrentUser } from '@/shared/decorators';
import { IDataloaders } from '@/types/dataloader';
import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GraphqlAuthGuard } from '../auth/guards/graphql-auth.guard';
import { Reservation } from '../reservation/entities/reservation.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(GraphqlAuthGuard)
  @Query(() => User)
  async me(@CurrentUser() user: User): Promise<User> {
    return await this.userService.findOne(user.id);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [User], { nullable: 'itemsAndList' })
  async users(): Promise<Array<User>> {
    return await this.userService.findAll();
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => User, { nullable: true })
  async user(@Args('id') id: string): Promise<User | null> {
    return await this.userService.findOne(id);
  }

  @Mutation(() => User)
  async createUser(
    @Args('input')
    createUserInput: CreateUserInput,
  ) {
    return await this.userService.create(createUserInput);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => User)
  async updateEvent(@Args('input') updateUserInput: UpdateUserInput) {
    return await this.userService.update(updateUserInput.id, updateUserInput);
  }

  @ResolveField(() => [Reservation], { nullable: 'itemsAndList' })
  async reservations(
    @Parent() { id }: User,
    @Context() { loaders }: { loaders: IDataloaders },
  ) {
    return await loaders.reservationsByUserIdsLoaders.load(id);
  }
}
