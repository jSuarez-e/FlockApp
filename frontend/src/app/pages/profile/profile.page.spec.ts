import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilePage } from './profile.page';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProfilePage - M\u00f3dulo Finalizaci\u00f3n Profile', () => {
  let fixture: ComponentFixture<ProfilePage>;
  let component: ProfilePage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePage, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deber\u00eda crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });
});
