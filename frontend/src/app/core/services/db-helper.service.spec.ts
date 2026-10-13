import { TestBed } from '@angular/core/testing';
import { DbHelperService } from './db-helper.service';
import { User, UserRole } from '../models/auth.models';

describe('DbHelperService', () => {
  let service: DbHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DbHelperService],
    });
    service = TestBed.inject(DbHelperService);
    localStorage.clear();
  });

  it('Debe persistir y recuperar la sesión correctamente', async () => {
    const mockToken = 'abc-123';
    const mockUser: User = {
      id: 1,
      email: 'test@test.com',
      firstName: 'Jaime',
      lastName: 'Suarez',
      username: 'jaimesuarez',
      role: UserRole.PAJARERO,
    };

    await service.saveSession(mockToken, mockUser);
    const session = await service.getSession();

    // 1. Validar que la sesión existe
    expect(session).not.toBeNull();
    expect(session?.token).toBe(mockToken);

    // 2. Validar el usuario (user_data)
    const rawUserData = session?.user_data;

    // Si es string (SQLite), parseamos. Si es objeto (Web), usamos directo.
    const recoveredUser: User =
      typeof rawUserData === 'string' ? JSON.parse(rawUserData) : rawUserData;

    expect(recoveredUser).toBeTruthy();
    expect(recoveredUser.id).toBe(1);
    expect(recoveredUser.firstName).toBe('Jaime');
  });

  it('Debe retornar null si no hay sesión', async () => {
    const session = await service.getSession();
    expect(session).toBeNull();
  });
});
