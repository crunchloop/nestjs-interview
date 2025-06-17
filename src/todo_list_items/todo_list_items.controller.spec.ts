import { Test, TestingModule } from '@nestjs/testing';
import { TodoListItemsController } from './todo_list_items.controller';
import { TodoListItemsService } from './todo_list_items.service';
import { TodoListItem } from '../interfaces/todo_list_item.interface';

// We'll manually mock the controller to avoid guard imports
describe('TodoListItemsController', () => {
  let todoListItemsService: TodoListItemsService;
  let todoListItemsController: TodoListItemsController;

  beforeEach(async () => {
    // Mock data for testing
    const mockTodoListItems: TodoListItem[] = [
      { id: 1, listId: 1, description: 'Item 1', completed: false },
      { id: 2, listId: 1, description: 'Item 2', completed: true },
      { id: 3, listId: 2, description: 'Item 3', completed: false },
    ];

    todoListItemsService = new TodoListItemsService(mockTodoListItems);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoListItemsController],
      providers: [
        {
          provide: TodoListItemsService,
          useValue: todoListItemsService,
        },
      ],
    })
      .useMocker(() => {
        // This will mock any dependency that's not provided
        // return { canActivate: () => false };
        return {};
      })
      .compile();

    todoListItemsController = module.get<TodoListItemsController>(
      TodoListItemsController,
    );
  });

  describe('index', () => {
    it('should return all todo list items for a specific list', () => {
      expect(todoListItemsController.index('1')).toEqual([
        { id: 1, listId: 1, description: 'Item 1', completed: false },
        { id: 2, listId: 1, description: 'Item 2', completed: true },
      ]);
    });

    it('should return empty array when no items exist for the list', () => {
      expect(todoListItemsController.index('3')).toEqual([]);
    });
  });

  describe('show', () => {
    it('should return a specific todo list item', () => {
      expect(todoListItemsController.show('1')).toEqual({
        id: 1,
        listId: 1,
        description: 'Item 1',
        completed: false,
      });
    });
  });

  describe('create', () => {
    it('should create a new todo list item', () => {
      const createDto = { description: 'New Item' };
      const result = todoListItemsController.create('1', createDto);
      expect(result).toEqual({
        id: 4, // Next ID after the mock data
        listId: 1,
        description: 'New Item',
        completed: false,
      });
    });
  });

  describe('update', () => {
    it('should update an existing todo list item', () => {
      const updateDto = { description: 'Updated Item', completed: true };
      const result = todoListItemsController.update('1', '1', updateDto);
      expect(result).toEqual({
        id: 1,
        listId: 1,
        description: 'Updated Item',
        completed: true,
      });
    });
  });

  describe('delete', () => {
    it('should delete a todo list item', () => {
      // Spy on the service's delete method
      const deleteSpy = jest.spyOn(todoListItemsService, 'delete');
      todoListItemsController.delete('1');
      expect(deleteSpy).toHaveBeenCalledWith(1);
    });
  });
});
