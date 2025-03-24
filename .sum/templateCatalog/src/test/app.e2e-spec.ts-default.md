import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { ApiResponseSchema } from '@common/schemas/api-response.schema';
import { UserSchema } from '@modules/users/entities/user.schema';

describe('API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api', () => {
    it('powinno zwrócić status działania API', () => {
      return request(app.getHttpServer())
        .get('/api')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({ message: 'API działa poprawnie' });
        });
    });
  });

  describe('GET /api/start', () => {
    it('powinno zwrócić poprawnie sformatowane dane startowe', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/start')
        .expect(200);

      console.log(
        'Otrzymana odpowiedź:',
        JSON.stringify(response.body, null, 2),
      );
      console.log(
        'Błędy walidacji:',
        ApiResponseSchema.safeParse(response.body).error?.format(),
      );

      // Sprawdzamy czy odpowiedź jest zgodna ze schematem
      const result = ApiResponseSchema.safeParse(response.body);
      expect(result.success).toBeTruthy();

      if (result.success) {
        expect(result.data.message).toBe('Witaj w API Food Stack!');
        expect(result.data.version).toBe('1.0.0');
        expect(Array.isArray(result.data.data.users)).toBeTruthy();
        expect(typeof result.data.data.usersCount).toBe('number');
      }
    });
  });

  describe('GET /api/user/:id', () => {
    it('powinno zwrócić użytkownika dla poprawnego ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/user/9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d')
        .expect(200);

      const result = UserSchema.safeParse(response.body);
      expect(result.success).toBeTruthy();

      if (result.success) {
        expect(result.data.name).toBe('Jan Kowalski');
        expect(result.data.email).toBe('jan.kowalski@example.com');
      }
    });

    it('powinno zwrócić błąd dla niepoprawnego ID', () => {
      return request(app.getHttpServer())
        .get('/api/user/niepoprawne_id')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty(
            'error',
            'Nie znaleziono użytkownika',
          );
        });
    });
  });
});
