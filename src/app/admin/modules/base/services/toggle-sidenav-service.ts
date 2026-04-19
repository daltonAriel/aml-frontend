import { Injectable, signal, type WritableSignal } from "@angular/core";
/**
 * ToggleSidenavService se encarga de abrir o cerrar el sidenav permitiendo la comunicacion entre componentes del sidenav,
 * creamos una instancia a nivel de el componente base y los demas componentes heredaran ese estado
 */
@Injectable()
export class ToggleSidenavService {
	private _navStatus: WritableSignal<boolean> = signal<boolean>(false);

	navStatus = this._navStatus.asReadonly();

	updateStatus() {
		this._navStatus.set(!this._navStatus());
	}

	setExpanded(){
		this._navStatus.set(false);
	}
}
