import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { registroRequest, RegistroResponse } from '../../../dtos/usuarios/registro-dto';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root',
})
export class Auth {
  private Api = "http://localhost:8082/usuarios"
  constructor(private http: HttpClient) { }

  registrarUsuario(data: registroRequest) {
    return this.http.post<RegistroResponse>(`${this.Api}/registrar`, data)
  }


  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getUserRole(): any {
    const token = this.getToken();
    if (!token) return null;

    const decoded: any = jwtDecode(token);
    return decoded.roles || decoded.role || null;
  }

  hasRole(role: string): boolean {
    const userRole = this.getUserRole();

    if (!userRole) return false;

    if (Array.isArray(userRole)) {
      return userRole.includes(role);
    }

    return userRole === role;
  }

  getUserInfo(): any {
    const token = this.getToken();
    if (!token) return null;

    const decoded: any = jwtDecode(token);
    return decoded;
  }

  getUserName(): string {
    const user = this.getUserInfo();
    return user?.nombre || user?.sub || 'Usuario';
  }

  getUserRoleLabel(): string {
    const role = this.getUserRole();

    if (Array.isArray(role)) {
      return role.includes('ROLE_ADMIN') ? 'Administrador' : 'Usuario';
    }

    return role === 'ROLE_ADMIN' ? 'Administrador' : 'Recorredor';
  }
}
