import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { TermsModalComponent } from './terms-modal.component';

describe('TermsModalComponent', () => {
  let component: TermsModalComponent;
  let fixture: ComponentFixture<TermsModalComponent>;
  let modalCtrlSpy: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    modalCtrlSpy = jasmine.createSpyObj('ModalController', ['dismiss']);

    await TestBed.configureTestingModule({
      imports: [TermsModalComponent],
      providers: [{ provide: ModalController, useValue: modalCtrlSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(TermsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call dismiss on modal controller', async () => {
    await component.dismiss();
    expect(modalCtrlSpy.dismiss).toHaveBeenCalled();
  });
});
