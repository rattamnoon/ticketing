## Run Container

```bash
$ docker compose -f docker-compose.yaml up -d
```

## Installation

```bash
$ pnpm install
```

## Migration

```bash
$ pnpm migration:up

$ pnpm seed:run
```

## ENV

```bash
SECRET_KEY=ticketing-secret-key
GOD_PASSWORD=ticketing-password

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_NAME=ticketing

REDIS_DEFAULT_TTL=3600
REDIS_HOST=localhost
REDIS_PORT='6379'
REDIS_URL=redis://redisc:6379
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## GragpQL schema

```graphql
# Sandbox: https://studio.apollographql.com/sandbox/explorer/
# URL: http://localhost:4000/graphql
# Header: Authorization Bearer token login response

# Register
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
  }
}

# Login
mutation Login($user: LoginInput!) {
  login(user: $user) {
    token
    tokenExpires
  }
}

# Get Me
query Me {
  me {
    id
    email
    lastname
    firstname
  }
}

# Create Event
mutation CreateEvent($input: CreateEventInput!) {
  createEvent(input: $input) {
    id
  }
}

# Update Event
mutation UpdateEvent($input: UpdateEventInput!) {
  updateEvent(input: $input) {
    id
  }
}

# Get Events
query Events {
  events {
    id
    name
    description
    date
    totalSeats
    status
    seats {
      id
      eventId
      zone
      row
      status
    }
  }
}

# Create Seat
mutation CreateSeat($input: CreateSeatInput!) {
  createSeat(input: $input) {
    id
  }
}

# Update Seat
mutation UpdateSeat($input: UpdateSeatInput!) {
  updateSeat(input: $input) {
    id
  }
}

# Get Seats
query Seats {
  seats {
    id
    eventId
    zone
    row
    status
  }
}

# Create Reservation
mutation CreateReservation($input: CreateReservationInput!) {
  createReservation(input: $input) {
    id
  }
}

# Update Reservation
mutation UpdateReservation($input: UpdateReservationInput!) {
  updateReservation(input: $input) {
    id
  }
}

# Get Reservations
query Reservations {
  reservations {
    id
    userId
    seatId
    status
    user {
      id
      email
      firstname
      lastname
    }
    seat {
      id
      eventId
      zone
      row
      status
    }
  }
}
```

# ticketing
