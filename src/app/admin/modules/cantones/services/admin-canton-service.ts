import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import type { ApiResponse } from "@config/apiResponse";
import { environment } from "@config/enviroment";
import type { Observable } from "rxjs";
import type { CantonInterface } from "../interfaces/canton-interface";

@Injectable()
export class AdminCantonService {
  private _http = inject(HttpClient);
  private _baseUrl = environment.apiUrl;

  buscarCantonesProvinciaId(provinciaId: string): Observable<ApiResponse<CantonInterface[]>> {
    return this._http.get<ApiResponse<CantonInterface[]>>(`${this._baseUrl}/cantones/provincia/${provinciaId}`);
  }
}
