import type { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { TodoListsModule } from './todo_lists/todo_lists.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(TodoListsModule);

  await app.listen(3000);
}

bootstrap();
