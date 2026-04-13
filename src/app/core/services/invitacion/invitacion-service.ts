import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class InvitacionService {
 private Api = `${environment.api}/invitaciones`

  constructor(private http: HttpClient) { }

  crearInvitacion(puestoId: number) {
    return this.http.post<string>(`${this.Api}/crearInvitacion`, { puestoId })
  }

}
