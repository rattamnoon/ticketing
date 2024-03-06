import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import dayjs from 'dayjs';

import { User } from '@/database/entities/user.entity';
import { JwtPayload } from '@/features/auth/interfaces/jwt-payload.interfaces';
import { UserService } from '@/features/user/user.service';
import { LoginInput } from '../user/dto/login-input';
import { Login } from '../user/entities/login.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUserByPassword(input: LoginInput): Promise<Login | undefined> {
    const userToAttempt = await this.userService.findOneBy({
      email: input.email,
    });

    if (!userToAttempt) {
      return undefined;
    }

    try {
      if (!(await argon2.verify(userToAttempt.password, input.password))) {
        return undefined;
      }
    } catch (err) {
      return undefined;
    }

    const result = await this.createToken(userToAttempt);

    return result;
  }

  async validateJwtPayload(payload: JwtPayload): Promise<User | undefined> {
    const user = await this.userService.findOneBy({
      id: payload.id,
    });

    if (!user) {
      return undefined;
    }

    return user;
  }

  async validateRefreshTokenPayload(
    payload: JwtPayload,
  ): Promise<User | undefined> {
    const user = await this.userService.findOneBy({ id: payload.id });

    if (!user) {
      return undefined;
    }

    return user;
  }

  async createToken(user: User): Promise<Login> {
    const token = this.createJwt(user);

    const result: Login = {
      user: user,
      token: token.token,
      tokenExpires: token.tokenExpires,
    };

    return result;
  }

  createJwt(user: User): {
    data: JwtPayload;
    token: string;
    tokenExpires: number;
  } {
    const data: JwtPayload = {
      email: user.email,
      id: user.id,
      type: 'token',
    };

    const jwt = this.jwtService.sign(data, { expiresIn: '7d' });

    return {
      data,
      token: jwt,
      tokenExpires: dayjs().add(7, 'D').unix(),
    };
  }
}
