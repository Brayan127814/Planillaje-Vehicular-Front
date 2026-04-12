export interface ParqueaderoResponse {
  id: number;
  numeroParqueadero: number;
  estado: string;
  nombrePuesto: string;
}

export interface PageParqueadero<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // página actual
  first: boolean;
  last: boolean;
  empty: boolean
}