import { Injectable } from '@nestjs/common';
import { TodoListItem } from '../interfaces/todo_list_item.interface';
import { CreateTodoListItemDto } from './dtos/create-todo_list_item';
import { UpdateTodoListItemDto } from './dtos/update-todo_list _item';

@Injectable()
export class TodoListItemsService {
  private readonly todoListItems: TodoListItem[];

  constructor(todoListItems: TodoListItem[] = []) {
    this.todoListItems = todoListItems;
  }

  all(listId: number): TodoListItem[] {
    return this.todoListItems.filter((x) => x.listId === Number(listId));
  }

  get(id: number): TodoListItem {
    return this.todoListItems.find((x) => x.id === Number(id));
  }

  create(dto: CreateTodoListItemDto): TodoListItem {
    const todoListItem: TodoListItem = {
      id: this.nextId(),
      listId: dto.listId,
      description: dto.description,
      completed: false,
    };

    this.todoListItems.push(todoListItem);

    return todoListItem;
  }

  update(id: number, dto: UpdateTodoListItemDto): TodoListItem {
    const todoListItem = this.todoListItems.find((x) => x.id == Number(id));

    // Update the record
    if (dto.description) {
      todoListItem.description = dto.description;
    }

    if (dto.completed) {
      todoListItem.completed = dto.completed;
    }

    return todoListItem;
  }

  delete(id: number): void {
    const index = this.todoListItems.findIndex((x) => x.id == Number(id));

    if (index > -1) {
      this.todoListItems.splice(index, 1);
    }
  }

  private nextId(): number {
    const last = this.todoListItems
      .map((x) => x.id)
      .sort()
      .reverse()[0];

    return last ? last + 1 : 1;
  }
}
