// componente para pasar errores
/** biome-ignore-all lint/complexity/useLiteralKeys: <No acceder con notacion de punto a las propiedades de los controles> */

import { Component, input } from "@angular/core";
import type { AbstractControl } from "@angular/forms";

@Component({
	standalone: true,
	selector: "error-login",
	template: `
    @if (checkControl()) {}
    <span class="pl-5 text-xs text-red-500 italic">
      {{ checkControl() }}
    </span>
  `,
})
export class ErrorLogin {
	control = input.required<AbstractControl>();

	checkControl = () => {
		const ctrl: AbstractControl = this.control();

		if (!ctrl.errors || !(ctrl.dirty || ctrl.touched)) return null;
		if (ctrl.errors["required"]) return "* Campo requerido";
		if (ctrl.errors["email"]) return "* Formato de correo no válido";
		
		return null;
	};
}
