import { Test, TestingModule } from '@nestjs/testing';
import { TodoItemsController } from './todo_items.controller';
import { TodoItemsService } from './todo_items.service';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodoItem } from './todo_item.entity';
import { TodoList } from './todo_list.entity';
import { CreateTodoItemDto } from './dtos/create-todo_item';
import { UpdateTodoItemDto } from './dtos/update-todo_item';

describe('TodoItemsController', () => {
  let app: INestApplication;
  let todoItemsController: TodoItemsController;
  let todoItemRepositoryMock: jest.Mocked<Record<string, jest.Mock>>;
  let todoListRepositoryMock: jest.Mocked<Record<string, jest.Mock>>;

  beforeEach(async () => {
    todoItemRepositoryMock = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
    };

    todoListRepositoryMock = {
      findOneBy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoItemsController],
      providers: [
        TodoItemsService,
        {
          provide: getRepositoryToken(TodoItem),
          useValue: todoItemRepositoryMock,
        },
        {
          provide: getRepositoryToken(TodoList),
          useValue: todoListRepositoryMock,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    todoItemsController = module.get<TodoItemsController>(TodoItemsController);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('findAllByListId', () => {
    it('should return all todo items by list id', async () => {
      const mockFoundTodoItems = [
        { id: 1, name: 'Leche', description: 'Conaprole', complete: false, todoListId: 1 },
        { id: 2, name: 'Manteca', description: 'Conaprole', complete: false, todoListId: 1 },
        { id: 3, name: 'Manteca', description: 'Conaprole', complete: true, todoListId: 1 }
      ];
      todoItemRepositoryMock.find.mockResolvedValue(mockFoundTodoItems);
      const result = await todoItemsController.getItemsByListID({ listId: 1 });
      expect(result).toEqual(mockFoundTodoItems);
    });

    it('should return empty array if no todo items are found in the list or if list does not exist', async () => {
      const mockFoundTodoItems = [];
      todoItemRepositoryMock.find.mockResolvedValue(mockFoundTodoItems);
      const result = await todoItemsController.getItemsByListID({ listId: 1 });
      expect(result).toEqual(mockFoundTodoItems);
    });
  });

  describe('get', () => {
    it('should return a single todo item by list id', async () => {
      const mockFoundTodoItem = { id: 1, name: 'Leche', description: 'Conaprole', complete: false, todoListId: 1 };
      todoItemRepositoryMock.findOne.mockResolvedValue(mockFoundTodoItem);
      const result = await todoItemsController.get({ listId: 1, itemId: 1 });
      expect(result).toEqual(mockFoundTodoItem);
    });

    it('should throw exception if no todo item is found in the list or if list does not exist', async () => {
      todoItemRepositoryMock.findOne.mockResolvedValue(null);
      await expect(todoItemsController.get({ listId: 1, itemId: 999 }))
        .rejects.toThrow('Todo item with id 999 not found in list 1');
    });
  });

  describe('create', () => {
    it('should create a new todo item', async () => {
      const createDto = { name: 'Leche', description: 'Conaprole' };
      const mockCreatedTodoItem = { id: 1, name: 'Leche', description: 'Conaprole', complete: false, todoListId: 1 };
      const mockFoundTodoList = { id: 1, name: 'Shopping List' };
      
      todoListRepositoryMock.findOneBy.mockResolvedValue(mockFoundTodoList);
      todoItemRepositoryMock.create.mockReturnValue(mockCreatedTodoItem);
      todoItemRepositoryMock.save.mockResolvedValue(mockCreatedTodoItem);
      
      const result = await todoItemsController.create({listId: 1}, createDto);
      expect(result).toEqual(mockCreatedTodoItem);
    });

    it('should not create a new todo item if the provided listId does not exist', async () => {
      const createDto = { name: 'Leche', description: 'Conaprole' };
      
      todoListRepositoryMock.findOneBy.mockResolvedValue(null);
      
      await expect(todoItemsController.create({listId: 5}, createDto))
        .rejects.toThrow('Todo list with id 5 was not found');
    });
  });

  describe('update', () => {
    let updateDto: UpdateTodoItemDto;
    let existingTodoItem: TodoItem;
    let updatedTodoItem: TodoItem;
    beforeEach(() => {
      updateDto = { name: 'Leche descremada', description: 'Parmalat', complete: false };
      existingTodoItem = { id: 1, name: 'Leche', description: 'Conaprole', complete: false, todoListId: 1 };
      updatedTodoItem = { id: 1, name: 'Leche descremada', description: 'Parmalat', complete: false, todoListId: 1 };
    });
    it('should update an existing item', async () => {
      todoItemRepositoryMock.findOne.mockResolvedValue(existingTodoItem);
      todoItemRepositoryMock.save.mockResolvedValue(updatedTodoItem);
      const result = await todoItemsController.update(
        { listId: 1, itemId: 1 },
        updateDto,
      );
      expect(result).toEqual(updatedTodoItem);
    });

    it('should not update an existing item if the provided listId or itemId does not match', async () => {
      todoItemRepositoryMock.findOne.mockResolvedValue(null);
      await expect(todoItemsController.update(
        { listId: 2, itemId: 1 },
        updateDto,
      )).rejects.toThrow('Todo item with id 1 not found in list 2');
    });
  });

  describe('delete', () => {
    it('should delete a todo item', async () => {
      todoItemRepositoryMock.delete.mockResolvedValue({ affected: 1 });
      await todoItemsController.delete({ listId: 1, itemId: 1 });
      expect(todoItemRepositoryMock.delete).toHaveBeenCalledWith({ todoListId: 1, id: 1 });
    });

    it('should not delete a todo item if it does not exist', async () => {
      todoItemRepositoryMock.delete.mockResolvedValue({ affected: 0 });
      await expect(todoItemsController.delete({ listId: 1, itemId: 999 }))
        .rejects.toThrow('Todo item with id 999 not found in list 1');
    });
  });
});
