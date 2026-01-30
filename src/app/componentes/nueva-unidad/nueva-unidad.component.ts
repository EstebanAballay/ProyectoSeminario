import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UnidadesService } from '../../servicios/unidades';

@Component({
  selector: 'app-nueva-unidad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nueva-unidad.component.html',
  styleUrls: ['./nueva-unidad.component.css']
})
export class NuevaUnidadComponent implements OnInit {

  unidadForm!: FormGroup;
  esEdicion = false;
  unidadId!: number;

  constructor(
    private fb: FormBuilder,
    private unidadesService: UnidadesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.unidadForm = this.fb.group({
      tipo: ['', Validators.required],
      patente: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      estado: ['', Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.unidadId = Number(id);
      const unidad = this.unidadesService.getUnidadById(this.unidadId);
      if (unidad) {
        this.esEdicion = true;
        this.unidadForm.patchValue(unidad);
      }
    }
  }

  guardarUnidad() {
    if (this.unidadForm.invalid) return;

    if (this.esEdicion) {
      this.unidadesService.actualizarUnidad(this.unidadId, this.unidadForm.value);
    } else {
      this.unidadesService.agregarUnidad(this.unidadForm.value);
    }

    this.router.navigate(['/lista-unidades']);
  }

  cancelar() {
    this.router.navigate(['/lista-unidades']);
  }
}
