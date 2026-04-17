import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../core/services/auth/auth';
import { form } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthLogin } from '../../../core/services/auth-login';

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
     private AuthLogin: AuthLogin , private router : Router
  ) {
    this.formsRegistro = fb.nonNullable.group({
      nombre: ["", [Validators.required]],
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
    })
  }

  ngOnInit(): void {
      this.token = this.route.snapshot.queryParamMap.get('token') || ''
      console.log('TOKEN DESDE LA URL', this.token)
      
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

    console.log(data)

    this.authService.registrarUsuario(data).subscribe({
      next: res => {
        this.mensajeExit = "Usuario Registrado con exito"
        this.errorMensaje = ''

        // 🔥 LOGIN AUTOMÁTICO
        this.AuthLogin.login({
          username: formValue.username,
          password: formValue.password
        }).subscribe({
          next: loginRes => {
            localStorage.setItem("accessToken", loginRes.AccessToken)
            localStorage.setItem("RefreshToken", loginRes.RefreshToken)

            console.log("AUTO LOGIN OK")
            console.log("Token guardado:", localStorage.getItem("accessToken"))

            // 🚀 REDIRECCIÓN
            this.router.navigate(["/dashboard"])
            
            this.isLoading = false
          },
          error: err => {
            console.error(err)
            this.errorMensaje = "Usuario creado pero error al iniciar sesión"
            this.isLoading = false
          }
        })
      },
      error: e => {
        console.error(e)
        
        // 🔥 Manejo específico para errores del token
        if (e.error && e.error.message) {
          const errorMessage = e.error.message.toLowerCase()
          
          if (errorMessage.includes('token ya fue usado') || errorMessage.includes('token already used')) {
            this.errorMensaje = "❌ Este enlace de invitación ya ha sido utilizado. No puedes registrarte nuevamente con el mismo enlace."
            this.tokenInvalido = true
            // Deshabilitar el formulario completo
            this.formsRegistro.disable()
          } 
          else if (errorMessage.includes('token inválido') || errorMessage.includes('token invalid')) {
            this.errorMensaje = "❌ El enlace de invitación es inválido. Por favor, contacta al administrador."
            this.tokenInvalido = true
            this.formsRegistro.disable()
          }
          else if (errorMessage.includes('username') || errorMessage.includes('ya existe')) {
            this.errorMensaje = "⚠️ Este nombre de usuario ya está en uso. Por favor, elige otro."
            // No deshabilitamos el formulario, solo el campo username
            this.formsRegistro.get('username')?.setErrors({ taken: true })
          }
          else {
            this.errorMensaje = `Error al registrar usuario: ${e.error.message}`
          }
        } else {
          this.errorMensaje = "Error al registrar usuario. Por favor, intenta de nuevo."
        }
        
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
}