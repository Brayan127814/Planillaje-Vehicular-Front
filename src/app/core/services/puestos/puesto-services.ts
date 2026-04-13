import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PuestoPageResponse, PuestoRequest, PuestoResponse } from '../../../dtos/puestos/puesto-request';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';
@Injectable({
  providedIn: 'root',
})
export class PuestoServices {
 private Api = `${environment.api}/puestos`

  constructor(private http: HttpClient) { }

  //REGISTRAR PUESTO
  registrarPuesto(data: PuestoRequest) {
    return this.http.post<PuestoResponse>(`${this.Api}/registrar`, data)
  }
  //OBTENER PUESTOS
  listarPuestos(page: number, size: number): Observable<PuestoPageResponse<PuestoResponse>> {
    const params = new HttpParams()
      .set("page", page)
      .set("size", size)
    return this.http.get<PuestoPageResponse<PuestoResponse>>(`${this.Api}/allPuestos`,{params})
  }



}
