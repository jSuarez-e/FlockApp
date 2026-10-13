import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusinessProfilePage } from './business-profile.page';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ModalController } from '@ionic/angular';

describe('BusinessProfilePage', () => {
  let component: BusinessProfilePage;
  let fixture: ComponentFixture<BusinessProfilePage>;

  beforeEach(async () => {
    const modalSpy = jasmine.createSpyObj('ModalController', ['create', 'dismiss']);

    await TestBed.configureTestingModule({
      imports: [BusinessProfilePage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ModalController, useValue: modalSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
