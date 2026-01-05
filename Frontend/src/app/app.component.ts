import { Component } from '@angular/core';
import { NgIf,AsyncPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { LoadingService } from './services/loading.service'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NgIf,AsyncPipe],   
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'transporte';
  constructor(public loadingService: LoadingService) {}
}

bootstrapApplication(AppComponent)
  .catch(err => console.error(err));