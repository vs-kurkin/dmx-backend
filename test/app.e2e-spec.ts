import App from '#app'
import type { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import supertest from 'supertest'

describe('Controller (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [App],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/ (GET)', () => {
    return supertest(app.getHttpServer())
    .get('/')
    .expect(200)
    .expect('Hello World!')
  })
})
