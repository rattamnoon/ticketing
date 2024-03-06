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
import { Seat } from '../seats/entities/seat.entity';
import { User } from '../user/entities/user.entity';
import { CreateReservationInput } from './dto/create-reservation.input';
import { UpdateReservationInput } from './dto/update-reservation.input';
import { Reservation } from './entities/reservation.entity';
import { ReservationService } from './reservation.service';

@Resolver(() => Reservation)
export class ReservationResolver {
  constructor(private readonly reservationService: ReservationService) {}

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Reservation)
  async createReservation(
    @Args('input') input: CreateReservationInput,
    @CurrentUser() user: User,
  ) {
    return await this.reservationService.create(input, user.id);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [Reservation])
  async reservations() {
    return await this.reservationService.findAll();
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => Reservation)
  async reservation(@Args('id') id: string) {
    return await this.reservationService.findOne(id);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Reservation)
  async updateReservation(
    @Args('input')
    input: UpdateReservationInput,
    @CurrentUser() user: User,
  ) {
    return await this.reservationService.update(input.id, input, user.id);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Reservation)
  async removeReservation(@Args('id') id: string) {
    return await this.reservationService.remove(id);
  }

  @ResolveField(() => User)
  async user(
    @Parent() { userId }: Reservation,
    @Context() { loaders }: { loaders: IDataloaders },
  ) {
    console.log('userId', userId);
    return await loaders.userLoaders.load(userId);
  }

  @ResolveField(() => Seat)
  async seat(
    @Parent() { seatId }: Reservation,
    @Context() { loaders }: { loaders: IDataloaders },
  ) {
    console.log(await loaders.seatLoaders.load(seatId));
    return await loaders.seatLoaders.load(seatId);
  }
}
