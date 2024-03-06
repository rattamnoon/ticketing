import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { LoginInput } from '../user/dto/login-input';
import { Login } from '../user/entities/login.entity';
import { AuthService } from './auth.service';

@Resolver('Auth')
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => Login)
  async login(@Args('user') user: LoginInput): Promise<Login> {
    const result = await this.authService.validateUserByPassword(user);

    if (result) {
      return result;
    }

    throw new BadRequestException(
      'Could not log-in with the provided credentials',
    );
  }
}
