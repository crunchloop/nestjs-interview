import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoItemDto } from './dtos/create-todo_item';
import { UpdateTodoItemDto } from './dtos/update-todo_item';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoItem } from './todo_item.entity';
import { TodoList } from './todo_list.entity';

@Injectable()
export class TodoItemsService {
  constructor(
    @InjectRepository(TodoItem)
    private readonly todoItemRepository: Repository<TodoItem>,
    @InjectRepository(TodoList)
    private readonly todoListRepository: Repository<TodoList>,
  ) {}

  async getItemsByListID(listId: number): Promise<TodoItem[]> {
    return await this.todoItemRepository.find({
      where: { todoListId: listId },
    });
  }

  async get(listId: number, itemId: number): Promise<TodoItem> {
    const item = await this.todoItemRepository.findOne({
      where: { id: itemId, todoListId: listId },
    });
    if (!item) {
      throw new NotFoundException(
        `Todo item with id ${itemId} not found in list ${listId}`,
      );
    }
    return item;
  }

  async create(dto: CreateTodoItemDto, listId: number): Promise<TodoItem> {
    const todoList = await this.todoListRepository.findOneBy({ id: listId });
    if (!todoList) {
      throw new NotFoundException(`Todo list with id ${listId} was not found`);
    }

    const item = this.todoItemRepository.create({
      name: dto.name,
      description: dto.description,
      todoListId: listId,
      complete: false,
    });
    return await this.todoItemRepository.save(item);
  }

  async update(
    listId: number,
    itemId: number,
    dto: UpdateTodoItemDto,
  ): Promise<TodoItem> {
    const existingItem = await this.todoItemRepository.findOne({
      where: { id: itemId, todoListId: listId },
    });
    if (!existingItem) {
      throw new NotFoundException(
        `Todo item with id ${itemId} not found in list ${listId}`,
      );
    }
    Object.assign(existingItem, dto);
    return await this.todoItemRepository.save(existingItem);
  }

  async delete(listId: number, itemId: number): Promise<void> {
    const result = await this.todoItemRepository.delete({
      todoListId: listId,
      id: itemId,
    });
    if (result.affected === 0) {
      throw new NotFoundException(
        `Todo item with id ${itemId} not found in list ${listId}`,
      );
    }
  }
}
