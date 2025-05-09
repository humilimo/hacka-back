import { Controller, Get, Patch, Query, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('balance')
  async getUserBalance(@Query('phoneNumber') phoneNumber: string) {
    return this.usersService.getUserBalanceByPhone(phoneNumber);
  }

  @Patch('balance')
  async updateUserBalance(@Query('phoneNumber') phoneNumber: string, @Body('balance') balance: number) {
    return this.usersService.updateUserBalance(phoneNumber, balance);
  }
} 