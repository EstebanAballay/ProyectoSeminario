import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UnidadService } from '../services/unidad.service';

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
  subtiposMap: Record<string, string[]> = {
    'camion': [],
    'acoplado': [],
    'semirremolque': []
  };

  subtiposDisponibles: string[] = [];

  constructor(private fb: FormBuilder,
              private unidadService: UnidadService,) {this.initForm();}

  async ngOnInit() {
    //obtener subtipos desde el back. Acoplado y semi tienen los mismos tipos
    const tiposCamiones = await this.unidadService.consultarCamiones();
    const tiposAcoplados = await this.unidadService.consultarAcoplados();
    console.log('Tipos de camiones:', tiposCamiones);

    this.subtiposMap['camion'] = tiposCamiones.map((tipo: any) => tipo.nombre);
    this.subtiposMap['acoplado'] = tiposAcoplados.map((tipo: any) => tipo.nombre);
    this.subtiposMap['semirremolque'] = this.subtiposMap['acoplado']

    this.unidadesForm.get('tipo')?.valueChanges.subscribe(tipo => {
      this.subtiposDisponibles = this.subtiposMap[tipo as keyof typeof this.subtiposMap] || [];
      this.unidadesForm.get('subtipo')?.setValue(''); // Resetear el subtipo al cambiar el tipo
    });
  }

  async guardarUnidad() {
    if (this.unidadesForm.valid) {
      const dto = {unidadTipo: this.unidadesForm.value.tipo,
                   unidadSubtipo: this.unidadesForm.value.subtipo,
                   patente: this.unidadesForm.value.patente,
                   capacidad: this.unidadesForm.value.capacidad,
                   precioKm: this.unidadesForm.value.precio,
                   cantidadEjes: this.unidadesForm.value.ejes
      }
      const response = await this.unidadService.crearUnidad(dto); 
      console.log('Unidad a guardar:', dto);
      alert('¡Unidad registrada con éxito!');
    }
  }

  cancelar() {
    this.unidadesForm.reset();
  }

  // Método auxiliar para mantener ordenado el código
  //Crea el formulario con sus validaciones
  private initForm() {
    this.unidadesForm = this.fb.group({
      patente: ['', [Validators.required, Validators.minLength(6)]],
      tipo: ['', Validators.required],
      subtipo: ['', Validators.required], 
      capacidad: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      precio: ['', Validators.required], 
      ejes: ['', Validators.required]     
    });
  }
}