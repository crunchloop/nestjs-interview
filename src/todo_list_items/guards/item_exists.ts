import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TodoListItemsService } from '../todo_list_items.service';

@Injectable()
export class TodoListItemExistsGuard implements CanActivate {
  constructor(private readonly todoListItemsService: TodoListItemsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { todoListId, todoListItemId } = request.params;

    const item = this.todoListItemsService.get(Number(todoListItemId));
    // Verify that the item exists and belongs to the specified list
    if (item?.listId !== Number(todoListId)) {
      throw new NotFoundException(`Item not found`);
    }

    return true;
  }
}
