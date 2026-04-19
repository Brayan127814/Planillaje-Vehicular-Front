import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { EmpresaRequest, EmpresaResponse } from '../../../dtos/empresa-dto/empresa-dto';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  private Api = `${environment.api}/empresas`
  constructor(private http: HttpClient) { }
  registrarEmpresa(data: EmpresaRequest) {
    return this.http.post<EmpresaResponse>(`${this.Api}/registrar`, data)
  }
}
