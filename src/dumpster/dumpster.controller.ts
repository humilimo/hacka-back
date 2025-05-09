import { Controller, Get, Post, Query, Body, Patch, Param } from '@nestjs/common';
import { DumpsterService } from './dumpster.service';

@Controller('dumpsters')
export class DumpsterController {
  constructor(private readonly dumpsterService: DumpsterService) {}

  @Patch(':id')
  async updateDumpster(@Param('id') id: string, @Body() dumpsterDto: DumpsterDto) {
    return this.dumpsterService.updateDumpster(id, dumpsterDto);
  }

  @Get('nearby')
  async getNearbyDumpsters(@Query('latitude') latitude: number, @Query('longitude') longitude: number) {
    return this.dumpsterService.getNearbyDumpsters(latitude, longitude);
  }
} 