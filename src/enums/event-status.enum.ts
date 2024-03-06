import { registerEnumType } from '@nestjs/graphql';

export enum EventStatus {
  // เปิดอีเว้นท์
  Open = 'open',
  // ปิดอีเว้นท์
  Close = 'close',
}

registerEnumType(EventStatus, {
  name: 'EventStatus',
  description: 'The status of the event',
});
