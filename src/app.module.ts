import { Module } from '@nestjs/common';
import { TodoListsModule } from './todo_lists/todo_lists.module';

@Module({
  imports: [TodoListsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
