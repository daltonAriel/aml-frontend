// componente para pasar errores
/** biome-ignore-all lint/complexity/useLiteralKeys: <No acceder con notacion de punto a las propiedades de los controles> */

import { Component, input } from "@angular/core";
import type { AbstractControl } from "@angular/forms";

@Component({
  standalone: true,
  selector: "error-user-login",
  template: `
    @if (checkControl()) {}
    <span class="pl-2 text-xs font-semibold text-red-500">
      {{ checkControl() }}
    </span>
  `,
})
export class ErrorUserLogin {
  control = input.required<AbstractControl>();

  checkControl = () => {
    const ctrl: AbstractControl = this.control();

    if (!ctrl.errors || !(ctrl.dirty || ctrl.touched)) return null;
    if (ctrl.errors["required"]) return "* Campo requerido";
    if (ctrl.errors["email"]) return "* Formato de correo no válido";

    return null;
  };
}
