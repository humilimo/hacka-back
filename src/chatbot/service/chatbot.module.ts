import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ComplaintModule } from 'src/complaint/complaint.module';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [ComplaintModule, UsersModule],
  providers: [ChatbotService],
})
export class ChatbotModule {}