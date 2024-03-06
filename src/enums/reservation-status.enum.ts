import { registerEnumType } from '@nestjs/graphql';

export enum ReservationStatus {
  Booking = 'booking',
  Confirmed = 'confirmed',
  Canceled = 'canceled',
}

registerEnumType(ReservationStatus, {
  name: 'ReservationStatus',
  description: 'The status of the event',
});
