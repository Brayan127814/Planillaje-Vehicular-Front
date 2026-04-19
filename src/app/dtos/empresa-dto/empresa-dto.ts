export interface EmpresaRequest {
    nombreEmpres: string,
    nit: string,
    nombre: string,
    username: string,
    password: string
}

export interface EmpresaResponse {
    id: number,
    nombreEmpresa: string,
    nit: string
}