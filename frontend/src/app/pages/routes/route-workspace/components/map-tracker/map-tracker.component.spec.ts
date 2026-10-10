/**
 * @sdd Map Tracker Component Tests
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapTrackerComponent } from './map-tracker.component';

describe('MapTrackerComponent', () => {
  let component: MapTrackerComponent;
  let fixture: ComponentFixture<MapTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapTrackerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MapTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
