import { Component } from '@angular/core';
<<<<<<< HEAD
import { NgIf,AsyncPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { LoadingService } from './services/loading.service'; 
=======
import { RouterOutlet } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d

@Component({
  selector: 'app-root',
  standalone: true,
<<<<<<< HEAD
  imports: [RouterOutlet,NgIf,AsyncPipe],   
=======
  imports: [RouterOutlet],   
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'transporte';
<<<<<<< HEAD
  constructor(public loadingService: LoadingService) {}
=======
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
}

bootstrapApplication(AppComponent)
  .catch(err => console.error(err));