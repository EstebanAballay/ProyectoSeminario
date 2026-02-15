import { Component } from '@angular/core';
import {RouterModule} from '@angular/router';
import { CommonModule} from '@angular/common';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanel {

}
