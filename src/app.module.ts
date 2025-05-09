import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatbotModule } from './chatbot/service/chatbot.module';
import { UsersModule } from './users/users.module';
import { ComplaintModule } from './complaint/complaint.module';
import { DumpsterModule } from './dumpster/dumpster.module';
@Module({
  imports: [
    ChatbotModule, 
    UsersModule,
    ComplaintModule,
    DumpsterModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
