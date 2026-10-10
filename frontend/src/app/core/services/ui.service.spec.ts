import { TestBed } from '@angular/core/testing';
import { UiService } from './ui.service';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';

/**
 * Suite de pruebas unitarias para UiService.
 */
describe('UiService', () => {
  let service: UiService;
  let toastCtrlSpy: jasmine.SpyObj<ToastController>;
  let loadingCtrlSpy: jasmine.SpyObj<LoadingController>;

  beforeEach(() => {
    const tSpy = jasmine.createSpyObj('ToastController', ['create']);
    const lSpy = jasmine.createSpyObj('LoadingController', ['create']);
    const aSpy = jasmine.createSpyObj('AlertController', ['create']);

    TestBed.configureTestingModule({
      providers: [
        UiService,
        { provide: ToastController, useValue: tSpy },
        { provide: LoadingController, useValue: lSpy },
        { provide: AlertController, useValue: aSpy },
      ],
    });

    service = TestBed.inject(UiService);
    toastCtrlSpy = TestBed.inject(ToastController) as jasmine.SpyObj<ToastController>;
    loadingCtrlSpy = TestBed.inject(LoadingController) as jasmine.SpyObj<LoadingController>;
  });

  it('Debe llamar a toastCtrl.create al mostrar un toast', async () => {
    const toastMock = jasmine.createSpyObj('HTMLIonToastElement', ['present']);
    toastCtrlSpy.create.and.returnValue(Promise.resolve(toastMock));

    await service.showToast('Test Message');

    expect(toastCtrlSpy.create).toHaveBeenCalled();
    expect(toastMock.present).toHaveBeenCalled();
  });

  it('Debe gestionar correctamente el ciclo de vida del loading', async () => {
    const loadingMock = jasmine.createSpyObj('HTMLIonLoadingElement', ['present', 'dismiss']);
    loadingCtrlSpy.create.and.returnValue(Promise.resolve(loadingMock));

    await service.showLoading();
    expect(loadingCtrlSpy.create).toHaveBeenCalled();
    expect(loadingMock.present).toHaveBeenCalled();

    await service.dismissLoading();
    expect(loadingMock.dismiss).toHaveBeenCalled();
  });
});
