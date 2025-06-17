import { Module } from '@nestjs/common';
import { TodoListsModule } from './todo_lists/todo_lists.module';
import { TodoListItemsModule } from './todo_list_items/todo_list_items.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    TodoListsModule,
    TodoListItemsModule,
    RouterModule.register([
      {
        path: 'api/todolists',
        module: TodoListsModule,
        children: [{ path: ':todoListId/items', module: TodoListItemsModule }],
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
