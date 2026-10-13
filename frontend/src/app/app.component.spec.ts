import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './core/services/auth.service';
import { DbHelperService } from './core/services/db-helper.service';
import { AuthStore } from './core/stores/auth.store';
import { SyncQueueStore } from './core/stores/sync-queue.store';
import { NativeBridgeService } from './core/services/native-bridge.service';
import { Router, provideRouter } from '@angular/router';
import { signal, WritableSignal } from '@angular/core';
import { User, UserRole } from './core/models/auth.models';

describe('AppComponent', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let dbHelperSpy: jasmine.SpyObj<DbHelperService>;
  let nativeBridgeSpy: jasmine.SpyObj<NativeBridgeService>;
  /** Espía de AuthStore */
  let authStoreSpy: jasmine.SpyObj<{ syncFromService: () => void }>;
  /** Espía de SyncQueueStore */
  let syncStoreSpy: jasmine.SpyObj<{ executeSyncCycle: () => Promise<void> }>;
  let router: Router;
  let currentUserSignal: WritableSignal<User | null>;

  beforeEach(async () => {
    currentUserSignal = signal<User | null>(null);

    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', [], {
      currentUser: currentUserSignal,
    });

    dbHelperSpy = jasmine.createSpyObj<DbHelperService>('DbHelperService', ['getSession']);
    nativeBridgeSpy = jasmine.createSpyObj<NativeBridgeService>('NativeBridgeService', [
      'configureStatusBar',
      'hideSplashScreen',
    ]);
    nativeBridgeSpy.configureStatusBar.and.returnValue(Promise.resolve());
    nativeBridgeSpy.hideSplashScreen.and.returnValue(Promise.resolve());

    authStoreSpy = jasmine.createSpyObj('AuthStore', ['syncFromService']);
    syncStoreSpy = jasmine.createSpyObj('SyncQueueStore', ['executeSyncCycle']);
    syncStoreSpy.executeSyncCycle.and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: DbHelperService, useValue: dbHelperSpy },
        { provide: NativeBridgeService, useValue: nativeBridgeSpy },
        { provide: AuthStore, useValue: authStoreSpy },
        { provide: SyncQueueStore, useValue: syncStoreSpy },
        provideRouter([]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
  });

  it('debe crearse correctamente', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('debe navegar a /home si existe una sesión válida', async () => {
    const mockUser: User = {
      id: 1,
      email: 'test@test.com',
      firstName: 'Jaime',
      lastName: 'Suarez',
      username: 'jaimesuarez',
      role: UserRole.PAJARERO,
    };

    dbHelperSpy.getSession.and.returnValue(
      Promise.resolve({
        token: 'abc',
        user_data: mockUser,
      }),
    );

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    await app.ngOnInit();

    expect(router.navigate).toHaveBeenCalledWith(['/home'], {
      replaceUrl: true,
    });
    expect(nativeBridgeSpy.hideSplashScreen).toHaveBeenCalled();
  });

  it('debe navegar a /auth/login si no existe sesión', async () => {
    dbHelperSpy.getSession.and.returnValue(Promise.resolve(null));

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    await app.ngOnInit();

    expect(router.navigate).toHaveBeenCalledWith(['/auth/login'], {
      replaceUrl: true,
    });
    expect(nativeBridgeSpy.hideSplashScreen).toHaveBeenCalled();
  });
});
