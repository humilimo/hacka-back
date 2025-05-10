import { Module } from '@nestjs/common';
import { DumpsterController } from './dumpster.controller';
import { DumpsterService } from './dumpster.service';

@Module({
  controllers: [DumpsterController],
  providers: [DumpsterService],
  exports: [DumpsterService], // Export the service if needed in other modules
})
export class DumpsterModule {} 