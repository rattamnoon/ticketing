import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphqlAuthGuard } from '../auth/guards/graphql-auth.guard';
import { CreateSeatInput } from './dto/create-seat.input';
import { UpdateSeatInput } from './dto/update-seat.input';
import { Seat } from './entities/seat.entity';
import { SeatsService } from './seats.service';

@Resolver(() => Seat)
export class SeatsResolver {
  constructor(private readonly seatsService: SeatsService) {}

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Seat)
  async createSeat(@Args('input') input: CreateSeatInput): Promise<Seat> {
    return await this.seatsService.create(input);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [Seat])
  async seats(): Promise<Seat[]> {
    return await this.seatsService.findAll();
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => Seat)
  async seat(@Args('id') id: string): Promise<Seat> {
    return await this.seatsService.findOne(id);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Seat)
  async updateSeat(@Args('input') input: UpdateSeatInput): Promise<Seat> {
    return await this.seatsService.update(input.id, input);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Seat)
  async removeSeat(@Args('id') id: string): Promise<boolean> {
    return await this.seatsService.remove(id);
  }
}
