/**
 * @sdd
 * - [Objetivo]: Pruebas unitarias para BirdCardComponent verificando renderizado, validación de imagen, fallback y badges.
 * - [I/O]: Inyecta BirdCardComponent y setea el input requerido 'bird'.
 * - [Edge Cases]: Imagen con guion '-', nula, vacía o URL válida, y manejo de errores de carga.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BirdCardComponent } from './bird-card.component';
import { IBirdSearch } from '../../../../../core/models/birds.interfaces';

describe('BirdCardComponent', () => {
  let component: BirdCardComponent;
  let fixture: ComponentFixture<BirdCardComponent>;

  const mockBird: IBirdSearch = {
    id: 1,
    scientific_name: 'Accipiter bicolor',
    english_name: 'Bicolored Hawk',
    common_name: 'Gavilán bicolor',
    min_altitude: 0,
    max_altitude: 2000,
    viewing_difficulty: 3,
    base_image: 'https://example.com/bicolor.jpg',
    family_id: 10,
    conservation_status_id: 1,
    habitat_id: 2,
    conservation_convention: 'LC',
    residency_description: 'Residente',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BirdCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BirdCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('bird', mockBird);
    fixture.detectChanges();
  });

  it('debe instanciar el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe detectar una URL de imagen válida correctamente', () => {
    expect(component.hasValidImage()).toBeTrue();
    expect(component.imageError()).toBeFalse();
  });

  it('debe identificar imágenes inválidas o con guion "-" y no cargarlas', () => {
    fixture.componentRef.setInput('bird', {
      ...mockBird,
      base_image: '-',
    });
    fixture.detectChanges();

    expect(component.hasValidImage()).toBeFalse();
  });

  it('debe activar el fallback cuando ocurre handleImageError()', () => {
    component.handleImageError();
    fixture.detectChanges();

    expect(component.imageError()).toBeTrue();
  });

  it('debe renderizar el nombre científico en el template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const nameEl = compiled.querySelector('.bird-card__scientific-name');
    expect(nameEl?.textContent).toContain('Accipiter bicolor');
  });

  it('debe renderizar el nivel de dificultad', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const levelEl = compiled.querySelector('.bird-card__difficulty-overlay');
    expect(levelEl?.textContent).toContain('Lvl 3');
  });
});
