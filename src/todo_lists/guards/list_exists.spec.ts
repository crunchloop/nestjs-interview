import { ExecutionContext, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TodoListsService } from '../todo_lists.service';
import { TodoListExistsGuard } from './list_exists';
import { TodoList } from '../../interfaces/todo_list.interface';

describe('TodoListExistsGuard', () => {
  let guard: TodoListExistsGuard;
  let todoListsService: TodoListsService;

  beforeEach(async () => {
    // Mock data for testing
    const mockTodoLists: TodoList[] = [
      { id: 1, name: 'List 1' },
      { id: 2, name: 'List 2' },
      { id: 3, name: 'List 3' },
    ];

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoListExistsGuard,
        {
          provide: TodoListsService,
          useValue: {
            get: jest.fn((id: number) => {
              return mockTodoLists.find((list) => list.id === Number(id));
            }),
          },
        },
      ],
    }).compile();

    guard = module.get<TodoListExistsGuard>(TodoListExistsGuard);
    todoListsService = module.get<TodoListsService>(TodoListsService);
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

    it('should return true when list exists', async () => {
      // Arrange
      const mockRequest = {
        params: { todoListId: '1' },
      };

      mockExecutionContext.switchToHttp().getRequest = jest
        .fn()
        .mockReturnValue(mockRequest);

      // Act & Assert
      await expect(guard.canActivate(mockExecutionContext)).resolves.toBe(true);
      expect(todoListsService.get).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when list does not exist', async () => {
      // Arrange
      const mockRequest = {
        params: { todoListId: '999' },
      };

      mockExecutionContext.switchToHttp().getRequest = jest
        .fn()
        .mockReturnValue(mockRequest);

      jest.spyOn(todoListsService, 'get').mockReturnValue(undefined);

      // Act & Assert
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        NotFoundException,
      );
      expect(todoListsService.get).toHaveBeenCalledWith('999');
    });
  });
});
