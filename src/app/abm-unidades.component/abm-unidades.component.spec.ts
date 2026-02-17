import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AbmUnidadesComponent } from './abm-unidades.component';

describe('AbmUnidadesComponent', () => {
  let component: AbmUnidadesComponent;
  let fixture: ComponentFixture<AbmUnidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, AbmUnidadesComponent ] 
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbmUnidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente de unidades', () => {
    expect(component).toBeTruthy();
  });

  it('el formulario de unidades debería ser inválido al inicio', () => {
    expect(component.unidadesForm.valid).toBeFalsy();
  });

  it('debería validar que la patente tenga al menos 6 caracteres', () => {
    let patente = component.unidadesForm.controls['patente'];
    patente.setValue('ABC');
    expect(patente.valid).toBeFalsy();
    
    patente.setValue('AA123BB');
    expect(patente.valid).toBeTruthy();
  });
});