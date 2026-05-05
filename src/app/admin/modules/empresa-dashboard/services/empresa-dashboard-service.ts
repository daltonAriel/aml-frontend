import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import type { ApiResponse } from "@config/apiResponse";
import { environment } from "@config/enviroment";
import type { Observable } from "rxjs";
import type { EmpresaDireccionesTemaInterface } from "../interfaces/empresa-direcciones-temas-interface";

@Injectable()
export class AdminEmpresaDashboardService {
  private _http = inject(HttpClient);
  private _baseUrl = environment.apiUrl;

  buscarEmpresaPorId(empresaId: string): Observable<ApiResponse<EmpresaDireccionesTemaInterface>> {
    return this._http.get<ApiResponse<EmpresaDireccionesTemaInterface>>(
      `${this._baseUrl}/empresas/${empresaId}/direcciones-logo`,
    );
  }


}
