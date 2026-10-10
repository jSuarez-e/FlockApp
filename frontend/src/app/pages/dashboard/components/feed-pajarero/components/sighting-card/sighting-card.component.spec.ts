import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SightingCardComponent } from './sighting-card.component';

describe('SightingCardComponent', () => {
  let _component: SightingCardComponent;
  let fixture: ComponentFixture<SightingCardComponent>;

  const mockSighting = {
    id: '1',
    userName: 'Test',
    speciesName: 'Bird',
    scientificName: 'Bird S.',
    photoUrl: '',
    description: 'Desc',
    likesCount: 0,
    isFavorite: false,
    isOwnPost: true,
    createdAt: new Date(),
    userId: '1',
    latitude: 0,
    longitude: 0,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SightingCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SightingCardComponent);
    _component = fixture.componentInstance;
    fixture.componentRef.setInput('post', mockSighting);
    fixture.detectChanges();
  });

  it('debe mostrar botones de edición si es el post propio', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('ion-button[color="danger"]')).toBeTruthy();
  });
});
