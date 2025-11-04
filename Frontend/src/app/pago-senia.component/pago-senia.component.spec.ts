import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoSeniaComponent } from './pago-senia.component';

describe('PagoSeniaComponent', () => {
  let component: PagoSeniaComponent;
  let fixture: ComponentFixture<PagoSeniaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoSeniaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagoSeniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
