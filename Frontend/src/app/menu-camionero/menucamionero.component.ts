import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // <-- ¡IMPORTANTE PARA ROUTERLINK!

@Component({
  selector: 'app-menucamionero',
  standalone: true,
  // Agregamos RouterModule y CommonModule a los imports
  imports: [CommonModule, RouterModule], 
  templateUrl: './menucamionero.component.html',
  styleUrls: ['./menucamionero.component.css']
})
export class MenucamioneroComponent {
  // Lógica del componente (si la necesitás)
}