import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TodoListsService } from '../todo_lists.service';

@Injectable()
export class TodoListExistsGuard implements CanActivate {
  constructor(private readonly todoListService: TodoListsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { todoListId } = request.params;

    const exists = this.todoListService.get(todoListId);
    if (!exists) {
      throw new NotFoundException('List not found');
    }

    return true;
  }
}
