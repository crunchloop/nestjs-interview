import { Module } from '@nestjs/common';
import { TodoListsController } from './todo_lists.controller';
import { TodoListsService } from './todo_lists.service';

@Module({
  imports: [],
  controllers: [TodoListsController],
  providers: [
    { provide: TodoListsService, useValue: new TodoListsService([]) },
  ],
  exports: [TodoListsService],
})
export class TodoListsModule {}
