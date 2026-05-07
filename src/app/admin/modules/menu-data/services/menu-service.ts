import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import type { ApiResponse } from "@config/apiResponse";
import { environment } from "@config/enviroment";
import type { Observable } from "rxjs";
import type {
  MenuInterface,
  MenuReordenarInterface,
  MenuRequestInterface,
} from "../interfaces/menu-constructor-interfaces";

@Injectable()
export class MenuService {
  private _http = inject(HttpClient);
  private _baseUrl = environment.apiUrl;

  obtenerMenu(): Observable<ApiResponse<MenuInterface[]>> {
    return this._http.get<ApiResponse<MenuInterface[]>>(`${this._baseUrl}/menu`);
  }

  actualizarOrden(menuReordenado: MenuReordenarInterface): Observable<ApiResponse<any>> {
    return this._http.put<ApiResponse<any>>(`${this._baseUrl}/menu/reordenar`, menuReordenado);
  }

  guardarMenu(menuData: MenuRequestInterface): Observable<ApiResponse<MenuInterface>> {
    return this._http.post<ApiResponse<MenuInterface>>(`${this._baseUrl}/menu`, menuData );
  }

  actualizarMenu(menuId: string, menuData: MenuRequestInterface,): Observable<ApiResponse<MenuInterface>> {
    return this._http.put<ApiResponse<MenuInterface>>(`${this._baseUrl}/menu/${menuId}`, menuData );
  }
}
