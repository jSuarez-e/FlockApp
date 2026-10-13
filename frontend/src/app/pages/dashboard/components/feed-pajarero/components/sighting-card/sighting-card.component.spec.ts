import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SightingCardComponent } from './sighting-card.component';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { provideRouter } from '@angular/router';
import { FeedPost } from '../../../../../../../../../shared/models/feed.model';

describe('SightingCardComponent', () => {
  let component: SightingCardComponent;
  let fixture: ComponentFixture<SightingCardComponent>;

  const mockSighting: FeedPost = {
    id: '1',
    authorId: '1',
    authorName: 'Test Pajarero',
    title: 'Avistamiento',
    imageUrl: '',
    description: 'Desc de prueba',
    savesCount: 0,
    repliesCount: 0,
    createdAt: new Date().toISOString(),
    location: null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SightingCardComponent],
      providers: [
        provideRouter([]),
        {
          provide: ModalController,
          useValue: jasmine.createSpyObj('ModalController', ['create', 'dismiss']),
        },
        {
          provide: ActionSheetController,
          useValue: jasmine.createSpyObj('ActionSheetController', ['create']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SightingCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('post', mockSighting);
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe renderizar la descripción del avistamiento', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const desc = compiled.querySelector('.post-description');
    expect(desc?.textContent).toContain('Desc de prueba');
  });

  it('debe renderizar el botón de compartir', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const shareBtn = compiled.querySelector('.metric-btn--share');
    expect(shareBtn).toBeTruthy();
  });
});
