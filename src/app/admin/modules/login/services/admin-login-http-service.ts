/** biome-ignore-all assist/source/organizeImports: <> */
/** biome-ignore-all lint/style/noNonNullAssertion: <> */
import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import type { ApiResponse } from "@config/apiResponse";
import { environment } from "@config/enviroment";
import { toast } from "ngx-sonner";
import { catchError, map, throwError, type Observable } from "rxjs";
import type { LoginRequestInterface } from "../interfaces/loginRequestIntrface";
import type { TokenInterface } from "../interfaces/tokenInterface";

@Injectable()
export class AdminLoginHttpService {
  private _http = inject(HttpClient);
  private _baseUrl = environment.apiUrl;

  protected readonly toast = toast;

  login(loginnRequest: LoginRequestInterface): Observable<ApiResponse<TokenInterface>> {
    return this._http
      .post<ApiResponse<TokenInterface>>(`${this._baseUrl}/auth/admin/login`, loginnRequest)
      .pipe(
        map((response: ApiResponse<TokenInterface>) => {
          const token = response.data?.token;
          sessionStorage.setItem("jwt", token!);
          return response;
        }),
        catchError((error) => {
          const _errorCode: number | undefined = error.error.status;
          if (_errorCode === 500) {
            this.toast.error("Error al iniciar sesión");
          }
          return throwError(() => error);
        }),
      );
  }
}
