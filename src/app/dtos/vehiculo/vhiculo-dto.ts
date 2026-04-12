export interface VehiculoRequest {
    placa: string,
    marca: string,
    numeroParqueader: number
}

export interface VehiculoResponse {
    id:number,
    placa: string,
    marca: string,
    numeroDeParqueadero: number
}


export interface PageResponseV<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}