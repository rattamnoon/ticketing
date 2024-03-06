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
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { Event } from './entities/event.entity';
import { EventService } from './event.service';

@Resolver(() => Event)
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Event)
  async createEvent(@Args('input') input: CreateEventInput) {
    return await this.eventService.create(input);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [Event])
  async events(): Promise<Event[]> {
    return await this.eventService.findAll();
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => Event)
  async event(@Args('id') id: string): Promise<Event> {
    return await this.eventService.findOne(id);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Event)
  async updateEvent(@Args('input') input: UpdateEventInput): Promise<Event> {
    return await this.eventService.update(input.id, input);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Event)
  async removeEvent(@Args('id') id: string) {
    return await this.eventService.remove(id);
  }

  @ResolveField(() => [Seat])
  async seats(
    @Parent() { id }: Event,
    @Context() { loaders }: { loaders: IDataloaders },
  ) {
    return await loaders.seatsLoaders.load(id);
  }
}
