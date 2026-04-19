import { computed, Injectable, signal } from "@angular/core";
import { jwtDecode } from "jwt-decode";
import type { AdminTokenInterface } from "../interfaces/admin-token";

@Injectable()
export class AdminSessionService {
	private _token = signal<string | null>(sessionStorage.getItem("jwt"));

	readonly sessionData = computed<AdminTokenInterface | null>(() => {
		const token = this._token();
		if (!token) return null;
		try {
			return jwtDecode<AdminTokenInterface>(token);
		} catch {
			return null;
		}
	});

  readonly nombre = computed(() => {
    const data = this.sessionData();
    return data ? `${data.usuarioNombre.toUpperCase()}` : '?';
  });

  readonly apellido = computed(() => {
    const data = this.sessionData();
    return data ? `${data.usuarioApellido.toUpperCase()}` : '?';
  });

  readonly rolDescripcion = computed(() => {
    const data = this.sessionData();
    return data ? `${data.usuarioRolDescripcion}` : '-';
  });

  readonly userRole = computed(() => this.sessionData()?.usuarioRolDescripcion || 'Sin Rol');
  
  readonly isSaas = computed(() => this.sessionData()?.isSaas || false);

  readonly roles = computed(() => 
    this.sessionData()?.roles.map(r => r.authority) || []
  );

  // actualiza token por interceptor
  updateToken(newToken: string) {
    localStorage.setItem('token', newToken);
    this._token.set(newToken);//este metodo actualiza todo a nivel del modulo Admin
  }


}
