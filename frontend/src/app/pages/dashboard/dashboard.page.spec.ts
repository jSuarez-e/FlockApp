import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardPage } from './dashboard.page';
import { DashboardStore } from '../../core/stores/dashboard.store';

describe('DashboardPage (Orquestador)', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;
  let dashboardStore: InstanceType<typeof DashboardStore>;

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
    const spy = spyOn(dashboardStore, 'setMode');
    component.handleRoleSelection('PAJARERO');
    expect(spy).toHaveBeenCalledWith('PAJARERO');
  });

  it('debe restablecer a null el modo al invocar changeViewMode()', () => {
    const spy = spyOn(dashboardStore, 'setMode');
    component.changeViewMode();
    expect(spy).toHaveBeenCalledWith(null);
  });
});
