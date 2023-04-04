import { Test, TestingModule } from '@nestjs/testing';
import { TodoListsController } from './todo_lists.controller';
import { TodoListsService } from './todo_lists.service';

describe('TodoListsController', () => {
  let todoListsController: TodoListsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TodoListsController],
      providers: [TodoListsService],
    }).compile();

    todoListsController = app.get<TodoListsController>(TodoListsController);
  });

  xdescribe('/todolist', () => {
    xit('should return the list of todolist', () => {
      // TODO:
      //
      // expect(todoListsController.index()).toBe('Hello World!');
    });
  });
});
