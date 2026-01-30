import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpleadosService, Empleado } from '../servicios/empleados';

@Component({
  selector: 'app-nuevo-empleado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nuevo-empleado.component.html',
  styleUrls: ['./nuevo-empleado.component.css']
})
export class NuevoEmpleadoComponent implements OnInit {
  empleadoForm!: FormGroup;
  modoEdicion = false;
  empleadoId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private empleadosService: EmpleadosService
  ) {}

  ngOnInit(): void {
    this.empleadoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      rol: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.modoEdicion = true;
        this.empleadoId = +id;
        const empleado = this.empleadosService.getEmpleadoById(this.empleadoId);
        if (empleado) {
          this.empleadoForm.patchValue(empleado);
        }
      }
    });
  }

  guardarEmpleado() {
    if (this.empleadoForm.invalid) return;

    if (this.modoEdicion) {
      this.empleadosService.actualizarEmpleado(this.empleadoId, this.empleadoForm.value);
      alert('Empleado modificado con éxito');
    } else {
      this.empleadosService.agregarEmpleado(this.empleadoForm.value);
      alert('Empleado creado con éxito');
    }

    this.router.navigate(['/lista-empleados']);
  }

  cancelar() {
    this.router.navigate(['/lista-empleados']);
  }
}
