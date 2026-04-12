import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InvitacionService {
  private Api = "http://localhost:8082/invitaciones"

  constructor(private http: HttpClient) { }

  crearInvitacion(puestoId: number) {
    return this.http.post<string>(`${this.Api}/crearInvitacion`, { puestoId })
  }

}
