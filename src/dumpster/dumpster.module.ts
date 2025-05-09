import { Module } from '@nestjs/common';
import { DumpsterController } from './dumpster.controller';
import { DumpsterService } from './dumpster.service';

@Module({
  controllers: [DumpsterController],
  providers: [DumpsterService],
})
export class DumpsterModule {} 