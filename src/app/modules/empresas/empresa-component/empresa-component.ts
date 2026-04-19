import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmpresaService } from '../../../core/services/empresaService/empresa-service';
import { AuthLogin } from '../../../core/services/auth-login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-empresa-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './empresa-component.html',
  styleUrl: './empresa-component.css',
})
export class EmpresaComponent {

  empresaForm!: ReturnType<FormBuilder['group']>
  mensajeExit = ''
  errorMensaje = ''
  loading: boolean = false


  constructor(private empresaService: EmpresaService, private fb: FormBuilder, private loginService: AuthLogin, private router: Router) {

    this.empresaForm = fb.nonNullable.group({
      nombreEmpresa: ["", [Validators.required]],
      nit: ["", [Validators.required]],
      nombre: ["", [Validators.required]],
      username: ["", [Validators.required]],
      password: ["", [Validators.required]]

    })
  }
  registro() {
    if (this.loading) {
      return
    }

    if (this.empresaForm.invalid) {
      this.empresaForm.markAsTouched()
      return
    }
    //Acitivar loading
    this.loading = true
    //LOIMPIAR MENSAJES ANTERIORES
    this.mensajeExit = ''
    this.errorMensaje = ''

    const formValue = this.empresaForm.getRawValue()


    this.empresaService.registrarEmpresa(this.empresaForm.value).subscribe({
      next: res => {
        this.mensajeExit = 'Empresa y usuario administrador registrado con exito'
        this.errorMensaje = ''

        this.loginService.login({
          username: formValue.username,
          password: formValue.password
        }).subscribe({
          next: loginRes => {
            localStorage.setItem("accessToken", loginRes.AccessToken)
            localStorage.setItem("RefreshToken", loginRes.RefreshToken)


            this.router.navigate(["/dashboard"])
            this.loading = false
          }, error: e => {
            console.error(e)
            this.errorMensaje = 'Error al realizar registro'
            this.loading= false
          }
        })
      }, error: e=>{
         console.error(e)
         
      }
    })


  }

}
