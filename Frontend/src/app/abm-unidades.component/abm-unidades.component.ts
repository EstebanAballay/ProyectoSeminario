import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-abm-unidades',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './abm-unidades.component.html',
  styleUrls: ['./abm-unidades.component.css']
})
export class AbmUnidadesComponent implements OnInit {
  unidadesForm!: FormGroup;

  // Definición de subtipos por categoría
  subtiposMap = {
    'camion': ['Cisterna', 'Frigorífico', 'Tracto Camión', 'Reparto'],
    'acoplado': ['Cisterna Aceite', 'Cisterna Leche', 'Cisterna Combustible', 'Mixto', 'Ganado', 'Granos', 'Arena/Piedra'],
    'semirremolque': ['Cisterna Aceite', 'Cisterna Leche', 'Cisterna Combustible', 'Mixto', 'Ganado', 'Granos', 'Arena/Piedra']
  };

  subtiposDisponibles: string[] = [];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.unidadesForm = this.fb.group({
      patente: ['', [Validators.required, Validators.minLength(6)]],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      tipo: ['', Validators.required],
      capacidad: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
    });

    this.unidadesForm.get('tipo')?.valueChanges.subscribe(tipo => {
      this.subtiposDisponibles = this.subtiposMap[tipo as keyof typeof this.subtiposMap] || [];
      this.unidadesForm.get('subtipo')?.setValue(''); // Resetear el subtipo al cambiar el tipo
    });
  }

  guardarUnidad() {
    if (this.unidadesForm.valid) {
      console.log('Unidad a guardar:', this.unidadesForm.value);
      alert('¡Unidad registrada con éxito!');
    }
  }

  cancelar() {
    this.unidadesForm.reset();
  }
}