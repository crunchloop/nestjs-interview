import { Injectable } from '@nestjs/common';
import { CreateTodoListDto } from './dtos/create-todo_list';
import { UpdateTodoListDto } from './dtos/update-todo_list';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoList } from './todo_list.entity';

@Injectable()
export class TodoListsService {
  constructor(
    @InjectRepository(TodoList)
    private readonly todoListRepository: Repository<TodoList>,
  ) {}

  async all(): Promise<TodoList[]> {
    return await this.todoListRepository.find();
  }

  async get(id: number): Promise<TodoList | null> {
    return await this.todoListRepository.findOneBy({ id });
  }

  async create(dto: CreateTodoListDto): Promise<TodoList> {
    const todoList = this.todoListRepository.create({ name: dto.name });
    return await this.todoListRepository.save(todoList);
  }

  async update(id: number, dto: UpdateTodoListDto): Promise<TodoList> {
    return await this.todoListRepository.save({ id, ...dto } as TodoList);
  }

  async delete(id: number): Promise<void> {
    await this.todoListRepository.delete(id);
  }
}
