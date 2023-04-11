import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TodoListsModule } from 'src/todo_lists/todo_lists.module';

describe('TodoListsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TodoListsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  xit('/ (GET)', () => {
    // TODO:
    //
    // return request(app.getHttpServer())
    //   .get('/')
    //   .expect(200)
    //   .expect([]);
  });
});
