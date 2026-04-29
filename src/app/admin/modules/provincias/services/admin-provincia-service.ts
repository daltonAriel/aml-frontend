import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import type { ApiResponse } from "@config/apiResponse";
import { environment } from "@config/enviroment";
import type { Observable } from "rxjs";
import type { ProvinciaInterface } from "../interfaces/provincia-interface";

@Injectable()
export class AdminProvinciaService {
  private _http = inject(HttpClient);
  private _baseUrl = environment.apiUrl;

  buscarProvincias(): Observable<ApiResponse<ProvinciaInterface[]>> {
    return this._http.get<ApiResponse<ProvinciaInterface[]>>(`${this._baseUrl}/provincias/todos`);
  }

  
}
