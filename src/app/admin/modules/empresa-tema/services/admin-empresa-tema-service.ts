import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import type { ApiResponse } from "@config/apiResponse";
import { environment } from "@config/enviroment";
import type { Observable } from "rxjs";
import type { ActualizarEmpresaTemaInterface } from "../interfaces/actualizar-empresa-tema-interface";
import type { AdminEmpresaTemaInterface } from "../interfaces/admin-empresa-tema-interface";

@Injectable()
export class AdminEmpresaTemaService {
  private _http = inject(HttpClient);
  private _baseUrl = environment.apiUrl;

  obtenerTemaEmpresaId(empresaId: string): Observable<ApiResponse<AdminEmpresaTemaInterface>> {
    return this._http.get<ApiResponse<AdminEmpresaTemaInterface>>(
      `${this._baseUrl}/empresas/${empresaId}/tema`,
    );
  }

  actualizarTemaEmpresaId(
    empresaId: string,
    tema: ActualizarEmpresaTemaInterface,
  ): Observable<ApiResponse<AdminEmpresaTemaInterface>> {
    return this._http.put<ApiResponse<AdminEmpresaTemaInterface>>(
      `${this._baseUrl}/empresas/${empresaId}/tema`,
      tema,
    );
  }

  actualizarLogo(empresaId: string, logo: File){
    const formData = new FormData();
    formData.append('temaLogo', logo);
    return this._http.put<ApiResponse<AdminEmpresaTemaInterface>>(
      `${this._baseUrl}/empresas/${empresaId}/tema/logo`,
      formData,
    );
  }

}
