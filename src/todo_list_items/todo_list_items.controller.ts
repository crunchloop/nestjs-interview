import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TodoListItem } from '../interfaces/todo_list_item.interface';
import { CreateTodoListItemDto } from './dtos/create-todo_list_item';
import { TodoListItemsService } from './todo_list_items.service';
import { TodoListExistsGuard } from 'src/todo_lists/guards/list_exists';
import { TodoListItemExistsGuard } from './guards/item_exists';
import { UpdateTodoListItemDto } from './dtos/update-todo_list _item';

@UseGuards(TodoListExistsGuard)
@Controller()
export class TodoListItemsController {
  constructor(private todoListItemsService: TodoListItemsService) {}

  @Get()
  index(@Param('todoListId') todoListId: string): TodoListItem[] {
    return this.todoListItemsService.all(Number(todoListId));
  }

  @Post()
  create(
    @Param('todoListId') todoListId: string,
    @Body() createItemDto: Omit<CreateTodoListItemDto, 'listId'>,
  ): TodoListItem {
    return this.todoListItemsService.create({
      ...createItemDto,
      listId: Number(todoListId),
    });
  }

  @UseGuards(TodoListItemExistsGuard)
  @Put(':todoListItemId')
  update(
    @Param('todoListId') todoListId: string,
    @Param('todoListItemId') todoListItemId: string,
    @Body() updateItemDto: Omit<UpdateTodoListItemDto, 'listId'>,
  ): TodoListItem {
    return this.todoListItemsService.update(Number(todoListItemId), {
      ...updateItemDto,
      listId: Number(todoListId),
    });
  }

  @UseGuards(TodoListItemExistsGuard)
  @Get(':todoListItemId')
  show(@Param('todoListItemId') todoListItemId: string): TodoListItem {
    return this.todoListItemsService.get(Number(todoListItemId));
  }

  @UseGuards(TodoListItemExistsGuard)
  @Delete(':todoListItemId')
  delete(@Param('todoListItemId') todoListItemId: string): void {
    return this.todoListItemsService.delete(Number(todoListItemId));
  }
}
