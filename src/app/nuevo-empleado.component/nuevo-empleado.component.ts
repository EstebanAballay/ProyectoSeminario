import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para directivas básicas como [disabled]
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms'; // La clave para el formGroup

@Component({
  selector: 'app-nuevo-empleado',
  standalone: true, // Indica que el componente se maneja solo
  imports: [CommonModule, ReactiveFormsModule], // <--- IMPORTANTE: Aquí se habilitan las herramientas para el HTML
  templateUrl: './nuevo-empleado.component.html',
  styleUrls: ['./nuevo-empleado.component.css']
})
export class NuevoEmpleadoComponent implements OnInit {
  empleadoForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    // Definimos la estructura del formulario y sus validaciones
    this.empleadoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      rol: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
    });
  }

  guardarEmpleado() {
    if (this.empleadoForm.valid) {
      console.log('Datos a enviar:', this.empleadoForm.value);
      alert('¡Empleado creado con éxito!');
    }
  }

  cancelar() {
    this.empleadoForm.reset();
  }
}