import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaUnidades } from './lista-unidades';

describe('ListaUnidades', () => {
  let component: ListaUnidades;
  let fixture: ComponentFixture<ListaUnidades>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaUnidades]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaUnidades);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
