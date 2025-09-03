import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateTodoItemDto } from './dtos/create-todo_item';
import { UpdateTodoItemDto } from './dtos/update-todo_item';
import { TodoItem } from '../interfaces/todo_item.interface';
import { TodoItemsService } from './todo_items.service';

@ApiTags('todo-items')
@Controller('api/todolists/:listId/items')
export class TodoItemsController {
  constructor(private itemService: TodoItemsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all todo items from a list' })
  @ApiParam({ name: 'listId', description: 'Todo list ID' })
  @ApiResponse({ status: 200, description: 'Returns all todo items from the specified list' })
  getItemsByListID(
    @Param() param: { listId: number },
  ): Promise<TodoItem[]> {
    return this.itemService.getItemsByListID(param.listId);
  }

  @Get('/:itemId')
  @ApiOperation({ summary: 'Get a specific todo item' })
  @ApiParam({ name: 'listId', description: 'Todo list ID' })
  @ApiParam({ name: 'itemId', description: 'Todo item ID' })
  @ApiResponse({ status: 200, description: 'Returns the todo item' })
  @ApiResponse({ status: 404, description: 'Todo item not found' })
  get(
    @Param() param: { listId: number; itemId: number },
  ): Promise<TodoItem> {
    return this.itemService.get(param.listId, param.itemId);
  }
  
  @Post()
  @ApiOperation({ summary: 'Create a new todo item' })
  @ApiParam({ name: 'listId', description: 'Todo list ID' })
  @ApiResponse({ status: 201, description: 'Todo item created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Todo list not found' })
  create(@Param() param: { listId: number }, @Body() dto: CreateTodoItemDto): Promise<TodoItem> {
    return this.itemService.create(dto, param.listId);
  }

  @Put('/:itemId')
  @ApiOperation({ summary: 'Update a todo item' })
  @ApiParam({ name: 'listId', description: 'Todo list ID' })
  @ApiParam({ name: 'itemId', description: 'Todo item ID' })
  @ApiResponse({ status: 200, description: 'Todo item updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Todo item not found' })
  update(
    @Param() param: { listId: number; itemId: number },
    @Body() dto: UpdateTodoItemDto,
  ): Promise<TodoItem> {
    return this.itemService.update(param.listId, param.itemId, dto);
  }

  @Delete('/:itemId')
  @ApiOperation({ summary: 'Delete a todo item' })
  @ApiParam({ name: 'listId', description: 'Todo list ID' })
  @ApiParam({ name: 'itemId', description: 'Todo item ID' })
  @ApiResponse({ status: 204, description: 'Todo item deleted successfully' })
  @ApiResponse({ status: 404, description: 'Todo item not found' })
  delete(@Param() param: { listId: number; itemId: number }): Promise<void> {
    return this.itemService.delete(param.listId, param.itemId);
  }
}
