import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ComplaintModule } from 'src/complaint/complaint.module';
import { UsersModule } from 'src/users/users.module';
import { DumpsterModule } from 'src/dumpster/dumpster.module';

@Module({
    imports: [ComplaintModule, UsersModule, DumpsterModule],
  providers: [ChatbotService],
})
export class ChatbotModule {}