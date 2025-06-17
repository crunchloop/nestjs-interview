import { Controller, Get } from '@nestjs/common';
import { McpService } from './mcp_service';

@Controller('mcp')
export class McpController {
  constructor(private readonly mcpService: McpService) {}

  @Get('status')
  async getStatus() {
    return {
      status: 'MCP Server is running',
      timestamp: new Date().toISOString(),
    };
  }
}
