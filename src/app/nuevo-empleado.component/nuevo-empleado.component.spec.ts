import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NuevoEmpleadoComponent } from './nuevo-empleado.component';

describe('NuevoEmpleadoComponent', () => {
  let component: NuevoEmpleadoComponent;
  let fixture: ComponentFixture<NuevoEmpleadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevoEmpleadoComponent ],
      imports: [ ReactiveFormsModule ] // Importante para que no falle el test
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test 1: ¿El componente se crea correctamente?
  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  // Test 2: ¿El formulario arranca inválido? (Porque está vacío)
  it('el formulario debería ser inválido al arrancar', () => {
    expect(component.empleadoForm.valid).toBeFalsy();
  });

  // Test 3: ¿Valida bien el DNI?
  it('debería validar que el DNI sea obligatorio', () => {
    let dni = component.empleadoForm.controls['dni'];
    expect(dni.valid).toBeFalsy();
    
    dni.setValue('12345678');
    expect(dni.valid).toBeTruthy();
  });
});