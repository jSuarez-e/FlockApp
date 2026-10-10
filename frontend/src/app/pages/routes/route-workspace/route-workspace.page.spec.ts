/**
 * @sdd Route Workspace Page Tests
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouteWorkspacePage } from './route-workspace.page';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ActiveRouteStore } from '../../../core/stores/active-route.store';
import { DbHelperService } from '../../../core/services/db-helper.service';
import { UiService } from '../../../core/services/ui.service';
import { GeographyService } from '../../../core/services/geography.service';

describe('RouteWorkspacePage', () => {
  let component: RouteWorkspacePage;
  let fixture: ComponentFixture<RouteWorkspacePage>;

  beforeEach(async () => {
    const activeRouteStoreMock = {
      loadRoute: jasmine.createSpy('loadRoute'),
      startTracking: jasmine.createSpy('startTracking'),
      isTracking: jasmine.createSpy('isTracking').and.returnValue(false),
      addPosition: jasmine.createSpy('addPosition'),
      startTime: jasmine.createSpy('startTime').and.returnValue(new Date().toISOString()),
      sightingsLog: jasmine.createSpy('sightingsLog').and.returnValue([]),
    };

    const dbHelperMock = {
      query: jasmine.createSpy('query').and.returnValue(Promise.resolve([])),
    };
    const uiMock = {
      showConfirm: jasmine.createSpy('showConfirm').and.returnValue(Promise.resolve(true)),
    };
    const geoMock = {
      getDepartments: jasmine.createSpy('getDepartments').and.returnValue(Promise.resolve([])),
      getMunicipalities: jasmine
        .createSpy('getMunicipalities')
        .and.returnValue(Promise.resolve([])),
    };

    const activatedRouteMock = {
      queryParams: of({ id: null, readonly: 'false' }),
    };

    await TestBed.configureTestingModule({
      imports: [RouteWorkspacePage],
      providers: [
        { provide: ActiveRouteStore, useValue: activeRouteStoreMock },
        { provide: DbHelperService, useValue: dbHelperMock },
        { provide: UiService, useValue: uiMock },
        { provide: GeographyService, useValue: geoMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RouteWorkspacePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should search users correctly', () => {
    const event = new CustomEvent('ionInput');
    Object.defineProperty(event, 'detail', { value: { value: 'Juan' } });
    component.searchUsers(event);
    expect(component.userSearchResults.length).toBeGreaterThan(0);
    expect(component.userSearchResults[0]['name']).toBe('Juan Pérez');
  });
});
