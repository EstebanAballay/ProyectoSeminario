import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms'; // no se usa ngModel, pero se puede omitir

@Component({
    selector: 'app-pago-senia',
    standalone: true,
    imports: [],
    templateUrl: './pago-senia.component.html',
    styleUrls: ['./pago-senia.component.css']
})
export class PagoSeniaComponent {
  // Referencias a los inputs del formulario
    @ViewChild('titularInput') titularInput!: ElementRef<HTMLInputElement>;
    @ViewChild('tarjetaInput') tarjetaInput!: ElementRef<HTMLInputElement>;
    @ViewChild('vencimientoInput') vencimientoInput!: ElementRef<HTMLInputElement>;
    @ViewChild('cvvInput') cvvInput!: ElementRef<HTMLInputElement>;

    onSubmit(event: Event) {
        event.preventDefault();

    const titular = this.titularInput.nativeElement.value.trim();
    const numeroTarjeta = this.tarjetaInput.nativeElement.value.trim();
    const vencimiento = this.vencimientoInput.nativeElement.value.trim();
    const cvv = this.cvvInput.nativeElement.value.trim();

    if (!titular || !numeroTarjeta || !vencimiento || !cvv) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    console.log('Formulario enviado ✅');
    console.log('Titular:', titular);
    console.log('Número de tarjeta:', numeroTarjeta);
    console.log('Vencimiento:', vencimiento);
    console.log('CVV:', cvv);

    alert('Formulario enviado correctamente ✅');
    }
}

