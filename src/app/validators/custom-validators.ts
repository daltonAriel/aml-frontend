/** biome-ignore-all lint/complexity/noStaticOnlyClass: <> */

import type { AbstractControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {
	static isNotEmpty(control: AbstractControl): ValidationErrors | null {
		const value = control.value;

		// null o undefined
		if (value === null || value === undefined) {
			return { required: true };
		}

		// string vacío
		if (typeof value === "string" && value.trim().length === 0) {
			return { required: true };
		}
		``;
		return null;
	}
}
