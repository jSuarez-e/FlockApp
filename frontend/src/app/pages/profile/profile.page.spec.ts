import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilePage } from './profile.page';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalController, ActionSheetController } from '@ionic/angular';

describe('ProfilePage - Módulo Finalización Profile', () => {
  let fixture: ComponentFixture<ProfilePage>;
  let component: ProfilePage;

  beforeEach(async () => {
    const modalSpy = jasmine.createSpyObj('ModalController', ['create']);
    const actionSheetSpy = jasmine.createSpyObj('ActionSheetController', ['create']);

    await TestBed.configureTestingModule({
      imports: [ProfilePage, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: ModalController, useValue: modalSpy },
        { provide: ActionSheetController, useValue: actionSheetSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });
});
