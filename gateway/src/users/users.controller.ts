import { Controller, Get, UseInterceptors, OnModuleInit, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { baseResponseInterceptor } from '@/filters/base-response-filter';
import { UsersServiceClient } from './auth';
import { ClientGrpc } from '@nestjs/microservices';

@UseInterceptors(baseResponseInterceptor)
@Controller('users')
export class UsersController implements OnModuleInit {

  private userService: UsersServiceClient;
  constructor(@Inject('auth') private client: ClientGrpc) {}
  onModuleInit() {
    this.userService = this.client.getService<UsersServiceClient>('UsersService');
  }

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.
  // }

  @Get()
  findAll() {
    return this.userService.findAllUsers({})
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
