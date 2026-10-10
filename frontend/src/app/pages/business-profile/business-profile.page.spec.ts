import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusinessProfilePage } from './business-profile.page';

describe('BusinessProfilePage', () => {
  let component: BusinessProfilePage;
  let fixture: ComponentFixture<BusinessProfilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
