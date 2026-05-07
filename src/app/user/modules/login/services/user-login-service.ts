import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ApiResponse } from "@config/apiResponse";
import { environment } from "@config/enviroment";
import { toast } from "ngx-sonner";
import { catchError, map, Observable, throwError } from "rxjs";
import { UserJWTInterface } from "../../../interfaces/user-token-interface";
import { UserLoginRequestInterface } from "../interfaces/login-interface";


@Injectable()
export class UserLoginService {
  private _http = inject(HttpClient)
  private _baseUrl = environment.apiUrl;
    protected readonly toast = toast;

    login(loginnRequest: UserLoginRequestInterface): Observable<ApiResponse<UserJWTInterface>> {
      return this._http
        .post<ApiResponse<UserJWTInterface>>(`${this._baseUrl}/auth/user/login`, loginnRequest)
        .pipe(
          map((response) => {
            const token = response.data!.token;
            localStorage.setItem("user-jwt", token);
            localStorage.setItem("user-refresh-token", token);
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