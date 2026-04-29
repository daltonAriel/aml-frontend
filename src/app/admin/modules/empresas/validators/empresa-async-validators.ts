/** biome-ignore-all lint/complexity/noStaticOnlyClass: <> */
import type { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { type Observable, of, timer } from "rxjs";
import { first, map, switchMap } from "rxjs/operators";
import type { AdminEmpresasService } from "../services/admin-empresas-service";

export class AdminEmpresaAsyncValidators {
  static nombreUnicoEmpresa(service: AdminEmpresasService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);

      return timer(500).pipe(
        switchMap(() => service.validarNombreEmpresa(control.value)),
        map((response) => (response.data?.present ? { nombreDuplicado: true } : null)),
        first(),
      );
    };
  }

  static nombreUnicoEmpresaId(service: AdminEmpresasService, empresaId: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);

      return timer(500).pipe(
        switchMap(() => service.validarNombreEmpresaId(empresaId, control.value)),
        map((exists) => (exists.data?.present ? { nombreDuplicado: true } : null)),
        first(),
      );
    };
  }

  static codigoUnicoEmpresa(service: AdminEmpresasService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);

      return timer(500).pipe(
        switchMap(() => service.validarCodigoEmpresa(control.value)),
        map((exists) => (exists.data?.present ? { codigoDuplicado: true } : null)),
        first(),
      );
    };
  }

  static codigoUnicoEmpresaId(service: AdminEmpresasService, empresaId: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);
      return timer(500).pipe(
        switchMap(() => service.validarCodigoEmpresaId(empresaId, control.value)),
        map((exists) => (exists.data?.present ? { codigoDuplicado: true } : null)),
        first(),
      );
    };
  }
}
