import type { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS for MCP server
  app.enableCors();

  await app.listen(3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`MCP SSE endpoint available at: ${await app.getUrl()}/mcp/sse`);
  console.log(`MCP endpoint available at: ${await app.getUrl()}/mcp`);
  console.log(`MCP status endpoint: ${await app.getUrl()}/mcp/status`);
}

bootstrap();
