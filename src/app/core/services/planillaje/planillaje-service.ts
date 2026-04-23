import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlanillajeRequest } from '../../../dtos/planillaje/planillajeRequest';
import { PlanillajeResponse } from '../../../dtos/planillaje/PlanillajeResponse';
import { Observable } from 'rxjs';
import { PageResponse } from '../../../dtos/planillaje/planillaje-paginados-dto';
import { PageResponseP } from '../../../dtos/planillaje/pageResponse';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class PlanillajeService {
  private Api = `${environment.api}/planillajeVehicular`

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

  planillajesDelDia(page: number, size: number): Observable<PageResponseP<PlanillajeResponse>> {
    {
      const params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString());
      return this.http.get<PageResponseP<PlanillajeResponse>>(
        `${this.Api}/todos`,
        { params }
      );
    }
  }
  contarPlnaillajesDelDia(fecha: string) {
    return this.http.get<number>(`${this.Api}/totalPordia`, {
      params: { fecha }
    });
  }
}
