import { ExecutionContext, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TodoListItemsService } from '../todo_list_items.service';
import { TodoListItemExistsGuard } from './item_exists';
import { TodoListItem } from '../../interfaces/todo_list_item.interface';

describe('TodoListItemExistsGuard', () => {
  let guard: TodoListItemExistsGuard;
  let todoListItemsService: TodoListItemsService;

  beforeEach(async () => {
    // Mock data for testing
    const mockTodoListItems: TodoListItem[] = [
      { id: 1, listId: 1, description: 'Item 1', completed: false },
      { id: 2, listId: 1, description: 'Item 2', completed: true },
      { id: 3, listId: 2, description: 'Item 3', completed: false },
    ];

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoListItemExistsGuard,
        {
          provide: TodoListItemsService,
          useValue: {
            get: jest.fn((id: number) => {
              return mockTodoListItems.find((item) => item.id === id);
            }),
          },
        },
      ],
    }).compile();

    guard = module.get<TodoListItemExistsGuard>(TodoListItemExistsGuard);
    todoListItemsService =
      module.get<TodoListItemsService>(TodoListItemsService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    let mockExecutionContext: ExecutionContext;

    beforeEach(() => {
      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            params: {},
          }),
        }),
      } as unknown as ExecutionContext;
    });

    it('should return true when item exists and belongs to the list', async () => {
      // Arrange
      const mockRequest = {
        params: { todoListId: '1', todoListItemId: '1' },
      };

      mockExecutionContext.switchToHttp().getRequest = jest
        .fn()
        .mockReturnValue(mockRequest);

      // Act & Assert
      await expect(guard.canActivate(mockExecutionContext)).resolves.toBe(true);
      expect(todoListItemsService.get).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when item does not exist', async () => {
      // Arrange
      const mockRequest = {
        params: { todoListId: '1', todoListItemId: '999' },
      };

      mockExecutionContext.switchToHttp().getRequest = jest
        .fn()
        .mockReturnValue(mockRequest);
      jest.spyOn(todoListItemsService, 'get').mockReturnValue(undefined);

      // Act & Assert
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        NotFoundException,
      );
      expect(todoListItemsService.get).toHaveBeenCalledWith(999);
    });

    it('should throw NotFoundException when item exists but belongs to a different list', async () => {
      // Arrange
      const mockRequest = {
        params: { todoListId: '1', todoListItemId: '3' },
      };

      mockExecutionContext.switchToHttp().getRequest = jest
        .fn()
        .mockReturnValue(mockRequest);

      // Act & Assert
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        NotFoundException,
      );
      expect(todoListItemsService.get).toHaveBeenCalledWith(3);
    });
  });
});
