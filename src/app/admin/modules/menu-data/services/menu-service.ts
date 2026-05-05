import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import type { ApiResponse } from "@config/apiResponse";
import { environment } from "@config/enviroment";
import type { Observable } from "rxjs";
import type { MenuInterface } from "../interfaces/menu-constructor-interfaces";

@Injectable()
export class MenuService {
	private _http = inject(HttpClient);
	private _baseUrl = environment.apiUrl;

	obtenerMenu(): Observable<ApiResponse<MenuInterface>> {
		return this._http.get<ApiResponse<MenuInterface>>(`${this._baseUrl}/menu`);
	}

}
