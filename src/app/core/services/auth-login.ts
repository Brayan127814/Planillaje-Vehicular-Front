import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse, LoginRequest } from '../../dtos/usuarios/login-dto';
import { tap } from 'rxjs/operators';  // ← Importa tap

@Injectable({
  providedIn: 'root',
})
export class AuthLogin {
  private Api = "https://planillajevehicular-1.onrender.com/usuarios"

  constructor(private http: HttpClient) { }

  login(data: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.Api}/login`, data)
      .pipe(
        tap(response => {
          console.log('🔵 Respuesta del backend:', response);
          // Guardar el token inmediatamente cuando llega la respuesta
          if (response && response.AccessToken) {
            localStorage.setItem("AccessToken", response.AccessToken);
            localStorage.setItem("RefreshToken", response.RefreshToken);
            console.log('✅ Token guardado en localStorage');
          }
        })
      );
  }
}