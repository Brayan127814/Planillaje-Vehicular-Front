import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageParqueadero, ParqueaderoResponse } from '../../../dtos/parqueaderos-dto/parqueadero-response';
import { PageResponse } from '../../../dtos/planillaje/planillaje-paginados-dto';

@Injectable({
   providedIn: 'root',
})
export class ParqueaderoService {
   private Api = "http://localhost:8082/parqueaderos"


   constructor(private http: HttpClient) { }

   //REGISTRAR LOS PARQUEADEROS
   registrarParqueadero(puestoId: number) {
      return this.http.post<ParqueaderoResponse>(`${this.Api}/registrar`, {  puestoId },{responseType:'json'})
   }
   //Obtener parqueaderos libres paginados
   obtenerParqueaderos(page: number, size: number): Observable<PageResponse<ParqueaderoResponse>> {
      const params = new HttpParams()
         .set('page', page)
         .set('size', size)

      return this.http.get<PageResponse<ParqueaderoResponse>>(`${this.Api}/parqueaderosPaginados`, { params })
   }
   //Obtener parqueaderos ocupados paginados
   parqueaderosOucpados(page: number, size: number): Observable<PageResponse<ParqueaderoResponse>> {
      const params = new HttpParams()
         .set("page", page)
         .set("size", size)
      return this.http.get<PageResponse<ParqueaderoResponse>>(`${this.Api}/ocupadosPaginados`, { params })
   }

   liberarParqueadero(parqueaderoId: number): Observable<string> {
      return this.http.post(`${this.Api}/liberar/${parqueaderoId}`, {}, {
         responseType: 'text' // <--- Esto le dice a Angular que no intente parsear JSON
      });
   }

}
