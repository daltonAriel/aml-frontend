import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import type { ApiResponse } from "@config/apiResponse";
import { environment } from "@config/enviroment";
import type { PageInterface } from "@interfaces/page-interface";
import type {
  ValidationIdInterface,
  ValidationInterface,
  ValidationResponseInterface,
} from "@interfaces/validations-interface";
import type { Observable } from "rxjs";
import type { CrearEmpresaInterface } from "../interfaces/crear-empresa-interface";
import type {
  EmpresaDireccionesInterface,
  EmpresaInterface,
} from "../interfaces/empresa-interface";

@Injectable()
export class AdminEmpresasService {
  private _http = inject(HttpClient);
  private _baseUrl = environment.apiUrl;

  buscarEmpresas(
    page: number,
    size: number,
    sortBy?: string | null,
    sortDir?: string | null,
    filtro?: string | null,
  ): Observable<ApiResponse<PageInterface<EmpresaInterface>>> {
    let params = new HttpParams().set("page", page.toString()).set("size", size.toString());

    if (filtro) {
      params = params.set("filtro", filtro);
    }

    if (sortBy) {
      params = params.set("sortBy", sortBy);
    }

    if (sortDir) {
      params = params.set("sortDir", sortDir);
    }
    return this._http.get<ApiResponse<PageInterface<EmpresaInterface>>>(
      `${this._baseUrl}/empresas`,
      { params },
    );
  }

  buscarEmpresaPorId(empresaId: string): Observable<ApiResponse<EmpresaInterface>> {
    return this._http.get<ApiResponse<EmpresaInterface>>(`${this._baseUrl}/empresas/${empresaId}`);
  }

  guardarEmpresa(empresa: CrearEmpresaInterface): Observable<ApiResponse<EmpresaInterface>> {
    return this._http.post<ApiResponse<EmpresaInterface>>(`${this._baseUrl}/empresas`, empresa);
  }

  actualizarEmpresa(
    empresaId: string,
    empresa: CrearEmpresaInterface,
  ): Observable<ApiResponse<EmpresaInterface>> {
    console.log(empresa)
    return this._http.put<ApiResponse<EmpresaInterface>>(
      `${this._baseUrl}/empresas/${empresaId}`,
      empresa,
    );
  }

  validarNombreEmpresa(valor: string): Observable<ApiResponse<ValidationResponseInterface>> {
    const data: ValidationInterface = { valor: valor };
    return this._http.post<ApiResponse<ValidationResponseInterface>>(
      `${this._baseUrl}/empresas/validar-empresa-nombre`,
      data,
    );
  }

  validarNombreEmpresaId(
    empresaId: string,
    valor: string,
  ): Observable<ApiResponse<ValidationResponseInterface>> {
    const data: ValidationIdInterface = { valor: valor, id: empresaId };
    return this._http.post<ApiResponse<ValidationResponseInterface>>(
      `${this._baseUrl}/empresas/validar-empresa-nombre/${empresaId}`,
      data,
    );
  }

  validarCodigoEmpresaId(
    empresaId: string,
    valor: string,
  ): Observable<ApiResponse<ValidationResponseInterface>> {
    const data: ValidationIdInterface = { valor: valor, id: empresaId };
    return this._http.post<ApiResponse<ValidationResponseInterface>>(
      `${this._baseUrl}/empresas/validar-empresa-codigo/${empresaId}`,
      data,
    );
  }

  validarCodigoEmpresa(valor: string): Observable<ApiResponse<ValidationResponseInterface>> {
    const data: ValidationInterface = { valor: valor };
    return this._http.post<ApiResponse<ValidationResponseInterface>>(
      `${this._baseUrl}/empresas/validar-empresa-codigo`,
      data,
    );
  }

  buscarEmpresaPorIdDirecciones(
    empresaId: string,
  ): Observable<ApiResponse<EmpresaDireccionesInterface>> {
    return this._http.get<ApiResponse<EmpresaDireccionesInterface>>(
      `${this._baseUrl}/empresas/${empresaId}/direcciones`,
    );
  }
}
