import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardPage } from './dashboard.page';
import { DashboardStore } from '../../core/stores/dashboard.store';

describe('DashboardPage (Orquestador)', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;
  let dashboardStore: typeof DashboardStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [DashboardStore],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    dashboardStore = TestBed.inject(DashboardStore);
    fixture.detectChanges();
  });

  it('debe cambiar la vista al recibir el evento del RoleSelector', () => {
    // Assuming DashboardStore has setMode
    const spy = spyOn(dashboardStore as Record<string, unknown>, 'setMode');
    component.handleRoleSelection('PAJARERO');
    expect(spy).toHaveBeenCalledWith('PAJARERO');
  });
});
