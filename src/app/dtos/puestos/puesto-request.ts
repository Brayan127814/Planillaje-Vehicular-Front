export interface PuestoRequest {
    nombrePuesto: string,
    direccion: string,
    totalParqueaderos: number
}

export interface PuestoResponse {
    id: number,
    nombrePuesto: string,
    totalParqueaderos: number
}

export interface PuestoPageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number; // página actual
    first: boolean;
    last: boolean;
    empty: boolean

}