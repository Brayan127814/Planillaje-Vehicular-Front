import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../core/services/auth/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthLogin } from '../../../core/services/auth-login';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-registro-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro-component.html',
  styleUrl: './registro-component.css',
})
export class RegistroComponent implements OnInit{
  formsRegistro!: ReturnType<FormBuilder["group"]>
  mensajeExit = ''
  errorMensaje = ''
  token: string = ''
  isLoading: boolean = false
  tokenInvalido: boolean = false  // 🔥 Nueva propiedad para marcar token inválido

  constructor(private authService: Auth, private fb: FormBuilder, private route: ActivatedRoute,
     private authLogin: AuthLogin , private router : Router
  ) {
    this.formsRegistro = fb.nonNullable.group({
      nombre: ["", [Validators.required]],
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
    })
  }

  ngOnInit(): void {
      this.token = this.route.snapshot.queryParamMap.get('token') || ''
     
      
      // Verificar si hay token en la URL
      if (!this.token) {
        this.errorMensaje = "Token de invitación no encontrado. Por favor, contacta al administrador."
        this.tokenInvalido = true
      }
  }

  registrar() {
    // Evitar envíos múltiples si ya está cargando
    if (this.isLoading) {
      return
    }

    // Si el token ya fue marcado como inválido, no continuar
    if (this.tokenInvalido) {
      this.errorMensaje = "Este enlace de invitación ya no es válido o ha sido usado."
      this.mostrarAlertaError(this.errorMensaje)
      return
    }

    if (this.formsRegistro.invalid) {
      this.formsRegistro.markAllAsTouched()
      return
    }

    // Activar loading
    this.isLoading = true
    
    // Limpiar mensajes anteriores
    this.mensajeExit = ''
    this.errorMensaje = ''

    const formValue = this.formsRegistro.getRawValue()

    const data = {
      ...formValue,
      token: this.token
    }

    this.authService.registrarUsuario(data).subscribe({
      next: res => {
        this.mensajeExit = "Usuario registrado con éxito"
        this.errorMensaje = ''

        // 🔥 LOGIN AUTOMÁTICO
        this.authLogin.login({
          username: formValue.username,
          password: formValue.password
        }).subscribe({
          next: loginRes => {
            localStorage.setItem("accessToken", loginRes.AccessToken)
            localStorage.setItem("RefreshToken", loginRes.RefreshToken)

            console.log("AUTO LOGIN OK")
            console.log("Token guardado:", localStorage.getItem("accessToken"))

            this.isLoading = false

            Swal.fire({
              title: 'Registro exitoso',
              text: 'Tu usuario fue creado correctamente.',
              icon: 'success',
              confirmButtonText: 'Continuar'
            }).then(() => {
              this.router.navigate(["/dashboard"])
            })
          },
          error: err => {
            console.error(err)
            this.errorMensaje = "Usuario creado pero error al iniciar sesión"
            this.mostrarAlertaError(this.errorMensaje)
            this.isLoading = false
          }
        })
      },
      error: e => {
        console.error(e)
        this.manejarErrorRegistro(e)
        this.mensajeExit = ''
        this.isLoading = false
      }
    })
  }
  
  // Método para resetear el formulario (opcional)
  resetFormulario() {
    this.formsRegistro.enable()
    this.formsRegistro.reset()
    this.errorMensaje = ''
    this.mensajeExit = ''
    this.tokenInvalido = false
    this.isLoading = false
  }

  private manejarErrorRegistro(e: any): void {
    const mensajeBack = e.error?.message?.toLowerCase() || ''

    if (mensajeBack.includes('token ya fue usado') || mensajeBack.includes('token already used')) {
      this.errorMensaje = "Este enlace de invitación ya ha sido utilizado. No puedes registrarte nuevamente con el mismo enlace."
      this.tokenInvalido = true
      this.formsRegistro.disable()
    }
    else if (mensajeBack.includes('token inválido') || mensajeBack.includes('token invalid')) {
      this.errorMensaje = "El enlace de invitación es inválido. Por favor, contacta al administrador."
      this.tokenInvalido = true
      this.formsRegistro.disable()
    }
    else if (mensajeBack.includes('username') || mensajeBack.includes('ya existe')) {
      this.errorMensaje = "Este nombre de usuario ya está en uso. Por favor, elige otro."
      this.formsRegistro.get('username')?.setErrors({ taken: true })
    }
    else if (e.error?.message) {
      this.errorMensaje = e.error.message
    }
    else if (typeof e.error === 'string') {
      this.errorMensaje = e.error
    }
    else if (e.status === 0) {
      this.errorMensaje = "No se pudo conectar con el servidor."
    }
    else {
      this.errorMensaje = "Error al registrar usuario. Por favor, intenta de nuevo."
    }

    this.mostrarAlertaError(this.errorMensaje)
  }

  private mostrarAlertaError(mensaje: string): void {
    Swal.fire({
      title: 'Error de registro',
      text: mensaje,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    })
  }
}
