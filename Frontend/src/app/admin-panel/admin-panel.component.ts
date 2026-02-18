import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanel {
  email: string = ''; 

async descargar() {
  if (!this.email) {
    alert("Por favor ingresa un email antes de enviar el reporte.");
    return;
  }

  try {
    const res = await fetch('https://oqtpegigitscnrjbbgwp.supabase.co/functions/v1/descarga2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: this.email })
    });

    const data = await res.json();
    if (res.ok) {
      alert(`Reporte enviado correctamente a ${this.email}`);
    } else {
      alert(`Error al enviar el reporte: ${data.error || 'Desconocido'}`);
    }
  } catch (err) {
    console.error("Error fetch:", err);
    alert("Ocurrió un error al enviar el reporte");
  }
}
}
