import { Module } from '@nestjs/common';
import { McpModule as ReKogMcpModule, McpTransportType } from '@rekog/mcp-nest';
import { McpController } from './mcp_controller';
import { McpService } from './mcp_service';

@Module({
  imports: [
    ReKogMcpModule.forRoot({
      name: 'NestJS-Todo-MCP',
      version: '1.0.0',
      transport: McpTransportType.STDIO,
      instructions:
        'Use this MCP server to test hello world functionality and get server information.',
    }),
  ],
  controllers: [McpController],
  providers: [McpService],
  exports: [McpService],
})
export class McpModule {}
