import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';

@Injectable()
export class McpService {
  @Tool({
    name: 'hello_world',
    description: 'A simple hello world tool to test MCP server setup',
    parameters: z.object({
      name: z.string().optional().describe('Name to greet (optional)'),
    }),
  })
  async helloWorld(params: { name?: string }) {
    const greeting = params?.name ? `Hello, ${params.name}!` : 'Hello, World!';
    return {
      content: [
        {
          type: 'text',
          text: greeting,
        },
      ],
    };
  }

  @Tool({
    name: 'get_server_info',
    description: 'Get information about the MCP server',
    parameters: z.object({}),
  })
  async getServerInfo() {
    const info = {
      name: 'NestJS Todo MCP Server',
      version: '1.0.0',
      description: 'MCP server for managing todo lists',
      capabilities: [
        'hello_world',
        'get_server_info',
        'get_all_todo_lists',
        'get_todo_list_by_id',
        'create_todo_list',
        'update_todo_list',
        'delete_todo_list',
        'get_todo_list_items',
        'get_todo_list_item_by_id',
        'create_todo_list_item',
        'update_todo_list_item',
        'delete_todo_list_item',
      ],
      status: 'running',
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(info),
        },
      ],
    };
  }

  @Tool({
    name: 'get_all_todo_lists',
    description: 'Fetch all todo lists via HTTP API call',
    parameters: z.object({}),
  })
  async getAllTodoLists() {
    try {
      const response = await fetch('http://localhost:3000/api/todolists');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const todoLists = await response.json();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(todoLists, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error fetching todo lists: ${error.message}`,
          },
        ],
      };
    }
  }

  @Tool({
    name: 'get_todo_list_by_id',
    description: 'Get a specific todo list by ID via HTTP API call',
    parameters: z.object({
      todoListId: z.number().describe('The ID of the todo list to retrieve'),
    }),
  })
  async getTodoListById(params: { todoListId: number }) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/todolists/${params.todoListId}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const todoList = await response.json();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(todoList, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error fetching todo list with ID ${params.todoListId}: ${error.message}`,
          },
        ],
      };
    }
  }

  @Tool({
    name: 'create_todo_list',
    description: 'Create a new todo list via HTTP API call',
    parameters: z.object({
      name: z.string().describe('The name of the new todo list'),
    }),
  })
  async createTodoList(params: { name: string }) {
    try {
      const response = await fetch('http://localhost:3000/api/todolists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: params.name }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newTodoList = await response.json();
      return {
        content: [
          {
            type: 'text',
            text: `Successfully created todo list: ${JSON.stringify(
              newTodoList,
              null,
              2,
            )}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error creating todo list: ${error.message}`,
          },
        ],
      };
    }
  }

  @Tool({
    name: 'update_todo_list',
    description: 'Update an existing todo list via HTTP API call',
    parameters: z.object({
      todoListId: z.number().describe('The ID of the todo list to update'),
      name: z.string().describe('The new name for the todo list'),
    }),
  })
  async updateTodoList(params: { todoListId: number; name: string }) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/todolists/${params.todoListId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: params.name }),
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedTodoList = await response.json();
      return {
        content: [
          {
            type: 'text',
            text: `Successfully updated todo list: ${JSON.stringify(
              updatedTodoList,
              null,
              2,
            )}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error updating todo list with ID ${params.todoListId}: ${error.message}`,
          },
        ],
      };
    }
  }

  @Tool({
    name: 'delete_todo_list',
    description: 'Delete a todo list by ID via HTTP API call',
    parameters: z.object({
      todoListId: z.number().describe('The ID of the todo list to delete'),
    }),
  })
  async deleteTodoList(params: { todoListId: number }) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/todolists/${params.todoListId}`,
        {
          method: 'DELETE',
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return {
        content: [
          {
            type: 'text',
            text: `Successfully deleted todo list with ID ${params.todoListId}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error deleting todo list with ID ${params.todoListId}: ${error.message}`,
          },
        ],
      };
    }
  }

  @Tool({
    name: 'get_todo_list_items',
    description: 'Get all items for a specific todo list via HTTP API call',
    parameters: z.object({
      todoListId: z.number().describe('The ID of the todo list to get items from'),
    }),
  })
  async getTodoListItems(params: { todoListId: number }) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/todolists/${params.todoListId}/items`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const items = await response.json();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(items, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error fetching items for todo list ${params.todoListId}: ${error.message}`,
          },
        ],
      };
    }
  }

  @Tool({
    name: 'get_todo_list_item_by_id',
    description: 'Get a specific todo list item by ID via HTTP API call',
    parameters: z.object({
      todoListId: z.number().describe('The ID of the todo list'),
      todoListItemId: z.number().describe('The ID of the todo list item to retrieve'),
    }),
  })
  async getTodoListItemById(params: { todoListId: number; todoListItemId: number }) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/todolists/${params.todoListId}/items/${params.todoListItemId}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const item = await response.json();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(item, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error fetching item ${params.todoListItemId} from list ${params.todoListId}: ${error.message}`,
          },
        ],
      };
    }
  }

  @Tool({
    name: 'create_todo_list_item',
    description: 'Create a new todo list item via HTTP API call',
    parameters: z.object({
      todoListId: z.number().describe('The ID of the todo list to add the item to'),
      description: z.string().describe('The description of the todo item'),
    }),
  })
  async createTodoListItem(params: { todoListId: number; description: string }) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/todolists/${params.todoListId}/items`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ description: params.description }),
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newItem = await response.json();
      return {
        content: [
          {
            type: 'text',
            text: `Successfully created todo item: ${JSON.stringify(
              newItem,
              null,
              2,
            )}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error creating todo item: ${error.message}`,
          },
        ],
      };
    }
  }

  @Tool({
    name: 'update_todo_list_item',
    description: 'Update an existing todo list item via HTTP API call',
    parameters: z.object({
      todoListId: z.number().describe('The ID of the todo list'),
      todoListItemId: z.number().describe('The ID of the todo list item to update'),
      description: z.string().optional().describe('The new description of the todo item'),
      completed: z.boolean().optional().describe('Whether the todo item is completed'),
    }),
  })
  async updateTodoListItem(params: {
    todoListId: number;
    todoListItemId: number;
    description?: string;
    completed?: boolean;
  }) {
    try {
      const updateData: any = {};
      if (params.description !== undefined) updateData.description = params.description;
      if (params.completed !== undefined) updateData.completed = params.completed;

      const response = await fetch(
        `http://localhost:3000/api/todolists/${params.todoListId}/items/${params.todoListItemId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedItem = await response.json();
      return {
        content: [
          {
            type: 'text',
            text: `Successfully updated todo item: ${JSON.stringify(
              updatedItem,
              null,
              2,
            )}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error updating todo item ${params.todoListItemId}: ${error.message}`,
          },
        ],
      };
    }
  }

  @Tool({
    name: 'delete_todo_list_item',
    description: 'Delete a todo list item by ID via HTTP API call',
    parameters: z.object({
      todoListId: z.number().describe('The ID of the todo list'),
      todoListItemId: z.number().describe('The ID of the todo list item to delete'),
    }),
  })
  async deleteTodoListItem(params: { todoListId: number; todoListItemId: number }) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/todolists/${params.todoListId}/items/${params.todoListItemId}`,
        {
          method: 'DELETE',
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return {
        content: [
          {
            type: 'text',
            text: `Successfully deleted todo item ${params.todoListItemId} from list ${params.todoListId}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error deleting todo item ${params.todoListItemId}: ${error.message}`,
          },
        ],
      };
    }
  }
}
