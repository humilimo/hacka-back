import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatbotModule } from './chatbot/service/chatbot.module';
import { UsersModule } from './users/users.module';
import { ComplaintModule } from './complaint/complaint.module';
@Module({
  imports: [
    ChatbotModule, 
    UsersModule,
    ComplaintModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
