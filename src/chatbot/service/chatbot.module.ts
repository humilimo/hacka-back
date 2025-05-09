import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ComplaintModule } from 'src/complaint/complaint.module';

@Module({
    imports: [ComplaintModule],
  providers: [ChatbotService],
})
export class ChatbotModule {}