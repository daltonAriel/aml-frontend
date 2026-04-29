import type {
	HttpErrorResponse,
	HttpHandlerFn,
	HttpInterceptorFn,
	HttpRequest,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { AdminSessionService } from "./admin-session-service";


export const adminHttpInterceptor: HttpInterceptorFn = (
	req: HttpRequest<unknown>,
	next: HttpHandlerFn,
) => {
	const sessionService = inject(AdminSessionService);
	//const router = inject(Router);

	const token = sessionService.getToken();

	// 1. Clonar la petición para inyectar el Header de Autorización
	let authReq = req;
	if (token) {
		authReq = req.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`,
			},
		});
	}

	// Enviamos y manejamos el resultado
	return next(authReq).pipe(
		catchError((error: HttpErrorResponse) => {
			// 401 (No Autorizado / Token Caducado)
			if (error.status === 401) {

				sessionService.logout();
				//router.navigate(["/login"]);
			}

			// Propagamos el error
			return throwError(() => error);
		}),
	);
};
