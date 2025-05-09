import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('balance')
  async getUserBalance(@Query('phoneNumber') phoneNumber: string) {
    return this.usersService.getUserBalanceByPhone(phoneNumber);
  }
} 