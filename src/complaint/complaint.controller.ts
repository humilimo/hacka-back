import { Controller, Get, Post, Query, Body, Patch, Param } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { ComplaintDto } from './dto/complaint.dto';

@Controller('complaints')
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  @Get()
  async getComplaints(@Query('phoneNumber') phoneNumber: string) {
    return this.complaintService.getComplaints(phoneNumber);
  }

  @Post()
  async createComplaint(@Body() complaintDto: ComplaintDto) {
    return this.complaintService.createComplaint(complaintDto);
  }

  @Patch(':id')
  async updateComplaint(@Param('id') id: string, @Body() complaintDto: ComplaintDto) {
    return this.complaintService.updateComplaint(id, complaintDto);
  }
} 