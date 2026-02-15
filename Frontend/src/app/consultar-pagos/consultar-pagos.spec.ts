import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarPagos } from './consultar-pagos';

describe('ConsultarPagos', () => {
  let component: ConsultarPagos;
  let fixture: ComponentFixture<ConsultarPagos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarPagos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarPagos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
