import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository } from 'typeorm';

import { User } from '@/database/entities/user.entity';
import { keyBy } from 'lodash';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(input: CreateUserInput) {
    const userExists = await this.userRepository.findOneBy({
      email: input.email,
    });

    if (userExists) {
      throw new Error('User already exists');
    }

    const user = new User();

    user.email = input.email;
    user.password = input.password;
    user.firstname = input.firstname;
    user.lastname = input.lastname;

    return await this.userRepository.save(user);
  }

  async findAll(): Promise<Array<User>> {
    const users = await this.userRepository.find();
    return users;
  }

  async findOne(id: string): Promise<User | null> {
    return await this.userRepository.findOneByOrFail({ id });
  }

  async findOneBy(options: FindOptionsWhere<User>): Promise<User> {
    return await this.userRepository.findOneByOrFail(options);
  }

  async update(id: string, input: UpdateUserInput) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new Error('User not found');
    }

    user.firstname = input.firstname;
    user.firstname = input.lastname;

    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<boolean | undefined> {
    const result = await this.userRepository.softDelete({ id });
    return !!result.affected;
  }

  async getUserByBatch(ids: Array<string>): Promise<Array<User>> {
    const users = await this.userRepository.find({
      where: { id: In(ids) },
    });

    const group = keyBy(users, (user) => user.id);

    return ids.map((id) => group[id]);
  }
}
