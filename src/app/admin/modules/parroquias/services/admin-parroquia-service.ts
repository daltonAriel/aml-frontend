import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import type { ApiResponse } from "@config/apiResponse";
import { environment } from "@config/enviroment";
import type { Observable } from "rxjs";
import type { ParroquiaInterface } from "../interfaces/parroquia-interface";

@Injectable()
export class AdminParroquiaService {
  private _http = inject(HttpClient);
  private _baseUrl = environment.apiUrl;

  buscarParroquiasCantonId(cantonId: string): Observable<ApiResponse<ParroquiaInterface[]>> {
    return this._http.get<ApiResponse<ParroquiaInterface[]>>(
      `${this._baseUrl}/parroquias/canton/${cantonId}`,
    );
  }
}
