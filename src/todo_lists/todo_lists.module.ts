import { Module } from '@nestjs/common';
import { TodoListsController } from './todo_lists.controller';
import { TodoListsService } from './todo_lists.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoList } from './todo_list.entity';
import { TodoItem } from './todo_item.entity';
import { TodoItemsController } from './todo_items.controller';
import { TodoItemsService } from './todo_items.service';

@Module({
  imports: [TypeOrmModule.forFeature([TodoList, TodoItem])],
  controllers: [TodoListsController, TodoItemsController],
  providers: [TodoListsService, TodoItemsService],
  exports: [TodoListsService, TodoItemsService],
})
export class TodoListsModule {}
