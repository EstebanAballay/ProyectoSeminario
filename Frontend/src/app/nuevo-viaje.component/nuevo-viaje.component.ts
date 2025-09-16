import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

declare var google: any; // 👈 esto declara google para TypeScript

@Component({
  selector: 'app-nuevo-viaje',
  templateUrl: './nuevo-viaje.component.html',
  styleUrls: ['./nuevo-viaje.component.css']
})
export class NuevoViajeComponent implements OnInit {
  @ViewChild('origenInput') origenInput!: ElementRef;
  @ViewChild('destinoInput') destinoInput!: ElementRef;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.origenInput) {
      new google.maps.places.Autocomplete(this.origenInput.nativeElement);
    }
    if (this.destinoInput) {
      new google.maps.places.Autocomplete(this.destinoInput.nativeElement);
    }
  }
}
