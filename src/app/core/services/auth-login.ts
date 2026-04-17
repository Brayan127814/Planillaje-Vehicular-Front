import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse, LoginRequest } from '../../dtos/usuarios/login-dto';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class AuthLogin {
  private Api = `${environment.api}/usuarios`

  constructor(private http: HttpClient) { }


  login(data: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.Api}/login`, data)
  }

}
