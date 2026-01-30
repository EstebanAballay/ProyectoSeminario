import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaUnidad } from './nueva-unidad';

describe('NuevaUnidad', () => {
  let component: NuevaUnidad;
  let fixture: ComponentFixture<NuevaUnidad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaUnidad]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevaUnidad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
