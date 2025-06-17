import { Module } from '@nestjs/common';
import { TodoListItemsController } from './todo_list_items.controller';
import { TodoListItemsService } from './todo_list_items.service';
import { TodoListsModule } from 'src/todo_lists/todo_lists.module';

@Module({
  controllers: [TodoListItemsController],
  providers: [
    { provide: TodoListItemsService, useValue: new TodoListItemsService([]) },
  ],
  imports: [TodoListsModule],
})
export class TodoListItemsModule {}
