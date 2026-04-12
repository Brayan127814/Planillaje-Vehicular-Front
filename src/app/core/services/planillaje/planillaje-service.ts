import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlanillajeRequest } from '../../../dtos/planillaje/planillajeRequest';
import { PlanillajeResponse } from '../../../dtos/planillaje/PlanillajeResponse';
import { Observable } from 'rxjs';
import { PageResponse } from '../../../dtos/planillaje/planillaje-paginados-dto';
import { PageResponseP } from '../../../dtos/planillaje/pageResponse';

@Injectable({
  providedIn: 'root',
})
export class PlanillajeService {
  private Api = "http://localhost:8082/planillajeVehicular"

  constructor(private http: HttpClient) { }


  registrarPlanillaje(data: PlanillajeRequest) {
    return this.http.post<PlanillajeResponse>(`${this.Api}/registrar`, data)
  }


  /*
  CONSULTAR ELPLANILLAJE DE UN VEHICULO
  */

  obtenerPlanillaje(
    placa: string,
    page: number,
    size: number
  ): Observable<PageResponse<PlanillajeResponse>> {

    const params = new HttpParams()
      .set('placa', placa)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<PlanillajeResponse>>(
      `${this.Api}/paginados`,
      { params }
    );
  }
}
