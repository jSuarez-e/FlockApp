import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './error.interceptor';
import { UiService } from '../services/ui.service';

describe('errorInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let uiServiceSpy: jasmine.SpyObj<UiService>;

  beforeEach(() => {
    uiServiceSpy = jasmine.createSpyObj('UiService', ['showToast', 'dismissLoading']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        { provide: UiService, useValue: uiServiceSpy },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('debería cerrar el loader y mostrar toast en caso de error 400', () => {
    httpClient.get('/test').subscribe({
      /**
       * Elemento documentado.
       */
      /**
       * Elemento documentado.
       */
      error: () => {
        expect(uiServiceSpy.dismissLoading).toHaveBeenCalled();
        expect(uiServiceSpy.showToast).toHaveBeenCalled();
      },
    });

    const req = httpMock.expectOne('/test');
    req.flush({ message: 'Bad Request' }, { status: 400, statusText: 'Error' });
  });
});
