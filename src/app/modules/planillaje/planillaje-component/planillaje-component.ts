import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlanillajeService } from '../../../core/services/planillaje/planillaje-service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
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
  isLoadingFoto = false


  mensaje: string = '';
  tipoMensaje: 'success' | 'error' | '' = '';

  constructor(private ps: PlanillajeService, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.formPlanillaje = fb.nonNullable.group({
      placa: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      novedadesPlanillaje: ["", [Validators.required]],

      detalle: [null]
    })
  }

  async onFotoCapturada(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]

    if (!file || this.listaFotos.length >= 6 || this.isLoadingFoto) {
      input.value = ''
      return
    }

    if (!file.type.startsWith('image/')) {
      this.mostrarErrorFoto('El archivo seleccionado no es una imagen.')
      input.value = ''
      return
    }

    this.isLoadingFoto = true

    try {
      const imagenComprimida = await this.comprimirImagen(file)
      this.listaFotos.push(imagenComprimida)
    } catch (error) {
      console.error('Error al procesar la foto:', error)
      this.mostrarErrorFoto('No se pudo procesar la foto. Intenta nuevamente.')
    } finally {
      this.isLoadingFoto = false
      input.value = ''
      this.cdr.markForCheck()
    }
  }

  //Eliminar foto
  eliminarFoto(index: number) {
    this.listaFotos.splice(index, 1)
  }

  normalizarPlaca() {
    const control = this.formPlanillaje.get('placa');
    const placa = control?.value || '';
    control?.setValue(placa.toUpperCase().slice(0, 6), { emitEvent: false });
  }

  obtenerMensajePlaca() {
    const placa = this.formPlanillaje.get('placa');

    if (placa?.errors?.['required']) return 'La placa es requerida.';
    if (placa?.errors?.['minlength'] || placa?.errors?.['maxlength']) {
      return 'La placa debe tener exactamente 6 caracteres.';
    }

    return '';
  }

  private comprimirImagen(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        const img = new Image()

        img.onload = () => {
          const maxWidth = 1024
          const scale = Math.min(1, maxWidth / img.width)
          const canvas = document.createElement('canvas')

          canvas.width = Math.round(img.width * scale)
          canvas.height = Math.round(img.height * scale)

          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('No se pudo preparar la imagen.'))
            return
          }

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          resolve(canvas.toDataURL('image/jpeg', 0.7))
        }

        img.onerror = () => reject(new Error('Imagen inválida.'))
        img.src = reader.result as string
      }

      reader.onerror = () => reject(new Error('No se pudo leer el archivo.'))
      reader.readAsDataURL(file)
    })
  }

  private mostrarErrorFoto(mensaje: string) {
    Swal.fire({
      title: 'Error al cargar foto',
      text: mensaje,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    })
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

        Swal.fire({
          title: '¡Éxito!',
          text: this.mensaje,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        })

        setTimeout(() => this.tipoMensaje = '', 4000);

      }, error: (e) => {
        console.error("ERROR BACK:", e);

        let mensajeBackend = 'No se puedo registrar el planillaje. Por favor, intenta nuevamente más tarde.';

        if (e.error?.message) {
          mensajeBackend = e.error.message;

        } else if (typeof e.error === 'string') {
          mensajeBackend = e.error;

        } else if (e.message) {
          mensajeBackend = e.message;

        } else {
          mensajeBackend = "Error inesperado del servidor";
        }


        Swal.fire({
          title: 'Error al registrar planillaje',
          text: mensajeBackend,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        })


        this.mensaje = mensajeBackend;
        this.tipoMensaje = 'error';


        this.cdr.markForCheck();
      }
    })
  }

  cerrarModal() {
    this.tipoMensaje = '';
  }
}
