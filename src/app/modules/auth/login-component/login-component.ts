import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthLogin } from '../../../core/services/auth-login';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { EmpresaComponent } from '../../empresas/empresa-component/empresa-component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  loginForm!: ReturnType<FormBuilder["group"]>
  errorMessage: string = ''
  exitmensaje: string = ''

  constructor(private auth: AuthLogin, private fb: FormBuilder, private router: Router) {
    this.loginForm = fb.nonNullable.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]]
    })
  }

  loginSesion() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched()
      return
    }
    this.auth.login(this.loginForm.value).subscribe({
      next: res => {
        localStorage.setItem("accessToken", res.AccessToken)
        localStorage.setItem("RefreshToken", res.RefreshToken)
        console.log("LOGIN EXITOSO")
        console.log(res.AccessToken)

        this.exitmensaje= 'Inicio de sesión exitoso'
        Swal.fire({
          title: '¡Bienvenido!',
          text: this.exitmensaje,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        })
        this.router.navigate(["/dashboard"])

      }, error: e => {
        this.errorMessage = 'Usuario o contraseña incorrectos'
        if (e.error?.message) {
          this.errorMessage = e.error.message

        } else if (typeof e.error === 'string') {
          this.errorMessage = e.error
        }else if(e.status === 0){
          this.errorMessage = "No se pudo conectar al servidor. Por favor, intenta nuevamente más tarde."
        }
          Swal.fire({
            title: 'Error de inicio de sesión',
            text: this.errorMessage,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          })
        console.error(e)
      }
    })
  }

}
