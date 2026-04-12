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
  }
registrar() {
  if (this.formsRegistro.invalid) {
    this.formsRegistro.markAllAsTouched()
    return
  }

  const formValue = this.formsRegistro.getRawValue() // 👈 guardamos antes del reset

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
          localStorage.setItem("RefreshToken", loginRes.refreshToken)

          console.log("AUTO LOGIN OK")

          // 🚀 REDIRECCIÓN
          this.router.navigate(["/dashboard"])

        },
        error: err => {
          console.error(err)
          this.errorMensaje = "Usuario creado pero error al iniciar sesión"
        }
      })

    },
    error: e => {
      console.error(e)
      this.errorMensaje = "Error al registrar usuario"
      this.mensajeExit = ''
    }
  })
}
  
}
