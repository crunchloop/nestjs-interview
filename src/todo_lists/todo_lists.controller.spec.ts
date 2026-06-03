import { Test, TestingModule } from '@nestjs/testing';
import { TodoListsController } from './todo_lists.controller';
import { TodoListsService } from './todo_lists.service';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodoList } from './todo_list.entity';

describe('TodoListsController', () => {
  let app: INestApplication;
  let todoListsController: TodoListsController;
  let todoListRepositoryMock: jest.Mocked<Record<string, jest.Mock>>;

  beforeEach(async () => {
    todoListRepositoryMock = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoListsController],
      providers: [
        TodoListsService,
        {
          provide: getRepositoryToken(TodoList),
          useValue: todoListRepositoryMock,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    todoListsController = module.get<TodoListsController>(TodoListsController);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('index', () => {
    it('should return all todo lists', async () => {
      const mockTodoLists = [
        { id: 1, name: 'Shopping List' },
        { id: 2, name: 'Work Tasks' },
      ];

      todoListRepositoryMock.find.mockResolvedValue(mockTodoLists);

      const result = await todoListsController.index();

      expect(result).toEqual(mockTodoLists);
    });
  });

  describe('show', () => {
    it('should return a single todo list by id', async () => {
      const mockTodoList = { id: 1, name: 'Shopping List' };
      todoListRepositoryMock.findOneBy.mockResolvedValue(mockTodoList);
      const result = await todoListsController.show({ todoListId: 1 });
      expect(result).toEqual(mockTodoList);
    });
  });

  describe('create', () => {
    it('should create a new todo list', async () => {
      const createDto = { name: 'New List' };
      const mockCreatedTodoList = { id: 1, name: 'New List' };

      todoListRepositoryMock.create.mockReturnValue(mockCreatedTodoList);
      todoListRepositoryMock.save.mockResolvedValue(mockCreatedTodoList);

      const result = await todoListsController.create(createDto);

      expect(result).toEqual(mockCreatedTodoList);
    });
  });

  describe('update', () => {
    it('should update an existing todo list', async () => {
      const updateDto = { name: 'Updated List' };
      const existingTodoList = { id: 1, name: 'Old Name' };
      const updatedTodoList = { id: 1, name: 'Updated List' };

      todoListRepositoryMock.findOneBy.mockResolvedValue(existingTodoList);
      todoListRepositoryMock.save.mockResolvedValue(updatedTodoList);

      const result = await todoListsController.update(
        { todoListId: '1' },
        updateDto,
      );

      expect(result).toEqual(updatedTodoList);
    });
  });

  describe('delete', () => {
    it('should delete a todo list', async () => {
      todoListRepositoryMock.delete.mockResolvedValue({ affected: 1 });
      await todoListsController.delete({ todoListId: 1 });
      expect(todoListRepositoryMock.delete).toHaveBeenCalledWith(1);
    });
  });
});
