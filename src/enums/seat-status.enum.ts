import { registerEnumType } from '@nestjs/graphql';

export enum SeatStatus {
  Available = 'available',
  Reserved = 'reserved',
}

registerEnumType(SeatStatus, {
  name: 'SeatStatus',
  description: 'The status of the event',
});
