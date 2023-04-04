import { Test, TestingModule } from '@nestjs/testing';
import { before } from 'node:test';
import { TodoListsController } from './todo_lists.controller';
import { TodoListsService } from './todo_lists.service';

describe('TodoListsController', () => {
  let todoListService: TodoListsService;
  let todoListsController: TodoListsController;

  beforeEach(async () => {
    todoListService = new TodoListsService([
      { id: 1, name: 'test1' },
      { id: 2, name: 'test2' },
    ]);

    const app: TestingModule = await Test.createTestingModule({
      controllers: [TodoListsController],
      providers: [{ provide: TodoListsService, useValue: todoListService }],
    }).compile();

    todoListsController = app.get<TodoListsController>(TodoListsController);
  });

  describe('index', () => {
    it('should return the list of todolist', () => {
      expect(todoListsController.index()).toEqual([
        { id: 1, name: 'test1' },
        { id: 2, name: 'test2' },
      ]);
    });
  });

  describe('show', () => {
    it('should return the todolist with the given id', () => {
      expect(todoListsController.show({ todoListId: 1 })).toEqual({
        id: 1,
        name: 'test1',
      });
    });
  });

  describe('update', () => {
    it('should update the todolist with the given id', () => {
      expect(
        todoListsController.update({ todoListId: 1 }, { name: 'modified' }),
      ).toEqual({ id: 1, name: 'modified' });

      expect(todoListService.get(1).name).toEqual('modified');
    });
  });

  describe('create', () => {
    it('should update the todolist with the given id', () => {
      expect(todoListsController.create({ name: 'new' })).toEqual({
        id: 3,
        name: 'new',
      });

      expect(todoListService.all().length).toBe(3);
    });
  });

  describe('delete', () => {
    it('should delete the todolist with the given id', () => {
      expect(() => todoListsController.delete({ todoListId: 1 })).not.toThrow();

      expect(todoListService.all().map((x) => x.id)).toEqual([2]);
    });
  });
});
