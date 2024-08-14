import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  FindOneUserDto,
  PaginationDto,
  UpdateUserDto,
  UsersServiceController,
  UsersServiceControllerMethods,
} from './auth';
import { Observable } from 'rxjs';

@Controller()
@UsersServiceControllerMethods()
export class UsersController implements UsersServiceController {
  constructor(private readonly usersService: UsersService) {}

  createUser(createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  findAllUsers() {
    return this.usersService.findAllUsers();
  }

  findOneUser({ id }: FindOneUserDto) {
    return this.usersService.findOneUser(id);
  }

  updateUser(updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(updateUserDto.id, updateUserDto);
  }

  removeUser({ id }: FindOneUserDto) {
    return this.usersService.removeUser(id);
  }

  queryUsers(paginationDtoStream: Observable<PaginationDto>) {
    return this.usersService.queryUsers(paginationDtoStream);
  }
}
