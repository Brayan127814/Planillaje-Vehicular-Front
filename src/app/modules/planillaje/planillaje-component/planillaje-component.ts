import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlanillajeService } from '../../../core/services/planillaje/planillaje-service';
import { ParqueaderoService } from '../../../core/services/parqueaderos/parqueadero-service';
import { ParqueaderoResponse } from '../../../dtos/parqueaderos-dto/parqueadero-response';
import { CommonModule, PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-planillaje-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './planillaje-component.html',
  styleUrl: './planillaje-component.css'
})
export class PlanillajeComponent {

  formPlanillaje!: ReturnType<FormBuilder["group"]>
  listaFotos: string[] = []


  mensaje: string = '';
  tipoMensaje: 'success' | 'error' | '' = '';

  constructor(private ps: PlanillajeService, private fb: FormBuilder, private cdr : ChangeDetectorRef) {
    this.formPlanillaje = fb.nonNullable.group({
      placa: ["", [Validators.required]],
      novedadesPlanillaje: ["", [Validators.required]],

      detalle: [null]
    })
  }

  //METODO PARA CAPTURAR FOTOS
  onFotoCapturada(event: any) {
    const files = event.target.files[0]
    if (files && this.listaFotos.length < 6) {
      const reader = new FileReader()
      reader.onload = () => {
        this.listaFotos.push(reader.result as string)
      }
      reader.readAsDataURL(files)
    }
  }

  //Eliminar foto
  eliminarFoto(index: number) {
    this.listaFotos.splice(index, 1)
  }

  registrarPlanillaje() {
    if (this.formPlanillaje.invalid) {
      this.formPlanillaje.markAllAsTouched()
      return;
    }

    const payload = { ...this.formPlanillaje.value, fotoBase64: this.listaFotos };
    if (payload.novedadesPlanillaje !== 'OTRO') {
      payload.detalle = '';
    }

    // Cambiado de this.formPlanillaje.value a payload para enviar los datos limpios
    this.ps.registrarPlanillaje(payload).subscribe({
      next: res => {
        console.log("Planillaje Registrado", res);

        // --- ACTIVAR MODAL ÉXITO ---
        this.mensaje = "Registro completado exitosamente.";
        this.tipoMensaje = 'success';
        this.formPlanillaje.reset();
        this.listaFotos = []
        this.cdr.markForCheck()

        setTimeout(() => this.tipoMensaje = '', 4000);

      },error: (e) => {
  console.error("ERROR BACK:", e);

  let mensajeBackend = '';

  if (e.error?.message) {
    mensajeBackend = e.error.message;

  } else if (typeof e.error === 'string') {
    mensajeBackend = e.error;

  } else if (e.message) {
    mensajeBackend = e.message;

  } else {
    mensajeBackend = "Error inesperado del servidor";
  }

  this.mensaje = mensajeBackend;
  this.tipoMensaje = 'error';

  // 🔥 ESTA ES LA CLAVE
  this.cdr.markForCheck();
}
    })
  }

  cerrarModal() {
    this.tipoMensaje = '';
  }
}