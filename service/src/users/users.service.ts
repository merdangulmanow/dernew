import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  CreateUserDto,
  PaginationDto,
  UpdateUserDto,
  User,
  Users,
} from './auth';
import { Observable, Subject } from 'rxjs';
import { randomInt, randomUUID } from 'crypto';
import { ArzaService } from '@/arza/arza.service';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(private readonly arzaService: ArzaService){}
  private readonly users: User[] = [];

  onModuleInit() {
    for (let i = 0; i <= 100; i++) {
      this.createUser({
        username: `user-${i}`,
        password: `random-password-${i}`,
        age: randomInt(20, 60),
      });
    }
  }

  createUser(dto: CreateUserDto): User {
    const user: User = {
      ...dto,
      subscribed: false,
      socialMedia: {},
      id: randomUUID(),
    };
    this.users.push(user);
    return user;
  }

  async findAllUsers(): Promise<Users> {
    const arza = await this.arzaService.findOneArza({id: 'clzsbjvge0000enp07iso8ebu'})
    console.log(typeof(arza))
    // console.log(">>>>>>>>>>>>>>>>>>>> arzaService Response")
    // console.log(Object.keys(arza))
    console.log(">>>>>>>>>>>>>>>>>>>> arzaService Response")
    console.log(Object.keys(arza))
    return { users: this.users };
  }

  findOneUser(id: string): User {
    return this.users.find((user) => user.id === id);
  }

  updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.users.find((user) => user.id === id);
  }

  removeUser(id: string) {
    return this.users.find((user) => user.id === id);
  }

  queryUsers(
    paginationDtoStream: Observable<PaginationDto>,
  ): Observable<Users> {
    const subject = new Subject<Users>();

    const onNext = (paginationDto: PaginationDto) => {
      const start = paginationDto.page * paginationDto.skip;
      subject.next({
        users: this.users.slice(start, start + paginationDto.skip),
      });
    };
    const onComplete = () => subject.complete();
    paginationDtoStream.subscribe({
      next: onNext,
      complete: onComplete,
    });

    return subject.asObservable();
  }
}
