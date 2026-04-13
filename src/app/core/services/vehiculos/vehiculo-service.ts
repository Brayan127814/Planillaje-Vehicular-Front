import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, numberAttribute } from '@angular/core';
import { PageResponseV, VehiculoRequest, VehiculoResponse } from '../../../dtos/vehiculo/vhiculo-dto';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class VehiculoService {

private Api = `${environment.api}/vehiculos`

  constructor(private http: HttpClient) { }

  registrarVehiculo(data: VehiculoRequest) {
    return this.http.post<VehiculoResponse>(`${this.Api}/registrar`, data)


  }

  //LISTAR VEHICULOS
  listarVehiculos(page: number, size: number): Observable<PageResponseV<VehiculoResponse>> {

    const params = new HttpParams().set("page", page).set("size", size)
    return this.http.get<PageResponseV<VehiculoResponse>>(`${this.Api}/vehiculos-paginados`, { params })
  }

  //Buscar vehiculos por placa
  listarVehiculoPlaca(placa: string): Observable<VehiculoResponse> {
    const params = new HttpParams()
      .set("placa", placa.toString())
    return this.http.get<VehiculoResponse>(`${this.Api}/placa`,{params})
  }

}
