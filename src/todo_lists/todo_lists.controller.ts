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
import { CreateTodoListDto } from './dtos/create-todo_list';
import { UpdateTodoListDto } from './dtos/update-todo_list';
import { TodoList } from '../interfaces/todo_list.interface';
import { TodoListsService } from './todo_lists.service';

@ApiTags('todo-lists')
@Controller('api/todolists')
export class TodoListsController {
  constructor(private todoListsService: TodoListsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all todo lists' })
  @ApiResponse({ status: 200, description: 'Returns all todo lists' })
  index(): Promise<TodoList[]> {
    return this.todoListsService.all();
  }

  @Get('/:todoListId')
  @ApiOperation({ summary: 'Get a specific todo list' })
  @ApiParam({ name: 'todoListId', description: 'Todo list ID' })
  @ApiResponse({ status: 200, description: 'Returns the todo list' })
  @ApiResponse({ status: 404, description: 'Todo list not found' })
  show(@Param() param: { todoListId: number }): Promise<TodoList | null> {
    return this.todoListsService.get(param.todoListId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new todo list' })
  @ApiResponse({ status: 201, description: 'Todo list created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() dto: CreateTodoListDto): Promise<TodoList> {
    return this.todoListsService.create(dto);
  }

  @Put('/:todoListId')
  @ApiOperation({ summary: 'Update a todo list' })
  @ApiParam({ name: 'todoListId', description: 'Todo list ID' })
  @ApiResponse({ status: 200, description: 'Todo list updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Todo list not found' })
  update(
    @Param() param: { todoListId: string },
    @Body() dto: UpdateTodoListDto,
  ): Promise<TodoList> {
    return this.todoListsService.update(Number(param.todoListId), dto);
  }

  @Delete('/:todoListId')
  @ApiOperation({ summary: 'Delete a todo list' })
  @ApiParam({ name: 'todoListId', description: 'Todo list ID' })
  @ApiResponse({ status: 204, description: 'Todo list deleted successfully' })
  @ApiResponse({ status: 404, description: 'Todo list not found' })
  delete(@Param() param: { todoListId: number }): Promise<void> {
    return this.todoListsService.delete(param.todoListId);
  }
}
