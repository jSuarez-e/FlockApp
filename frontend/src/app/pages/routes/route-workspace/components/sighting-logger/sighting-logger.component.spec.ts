/**
 * @sdd Sighting Logger Component Tests
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SightingLoggerComponent } from './sighting-logger.component';
import { AlertController } from '@ionic/angular';

describe('SightingLoggerComponent', () => {
  let component: SightingLoggerComponent;
  let fixture: ComponentFixture<SightingLoggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SightingLoggerComponent],
      providers: [AlertController],
    }).compileComponents();

    fixture = TestBed.createComponent(SightingLoggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute uniqueSpeciesCount based on sightingsLog input', () => {
    fixture.componentRef.setInput('sightingsLog', [{ id: '1' }, { id: '2' }]);
    fixture.detectChanges();
    expect(component.uniqueSpeciesCount()).toBe(2);
  });

  it('should emit search query on search input', () => {
    spyOn(component.searchQuery, 'emit');
    const mockEvent = new CustomEvent('ionInput');
    Object.defineProperty(mockEvent, 'target', { value: { value: 'Tangara' } });
    component.onSearchInput(mockEvent);
    expect(component.searchQuery.emit).toHaveBeenCalledWith('tangara');
  });

  it('should return fallback image if path is missing or hyphen', () => {
    expect(component.getBirdImageUrl(null)).toBe('assets/imgs/commons/no-image.png');
    expect(component.getBirdImageUrl('-')).toBe('assets/imgs/commons/no-image.png');
    expect(component.getBirdImageUrl('')).toBe('assets/imgs/commons/no-image.png');
  });

  it('should return valid bird image url if provided', () => {
    const validUrl = 'https://example.com/bird.jpg';
    expect(component.getBirdImageUrl(validUrl)).toBe(validUrl);
  });

  it('should set fallback image on image error event', () => {
    const img = document.createElement('img');
    const event = new Event('error');
    Object.defineProperty(event, 'target', { value: img });
    component.onImageError(event);
    expect(img.src).toContain('assets/imgs/commons/no-image.png');
  });
});
