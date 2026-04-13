import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthLogin } from '../../../core/services/auth-login';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  loginForm!: ReturnType<FormBuilder["group"]>

  constructor(private auth: AuthLogin, private fb: FormBuilder , private router:Router) {
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
        this.router.navigate(["/dashboard"])
        
      }, error: e =>{
         console.error(e)
      }
    })
  }

}
