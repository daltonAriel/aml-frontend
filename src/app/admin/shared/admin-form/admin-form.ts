/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import { CommonModule } from "@angular/common";
import {
	Component,
	computed,
	forwardRef,
	Input,
	input,
	signal
} from "@angular/core";
import {
	type AbstractControl,
	type ControlValueAccessor,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from "@angular/forms";

import { LucideAngularModule, type LucideIconData } from "lucide-angular";

@Component({
	selector: "admin-form",
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => AdminForm),
			multi: true,
		},
	],
	templateUrl: "./admin-form.html",
})
export class AdminForm implements ControlValueAccessor {
	@Input() FileIcon: LucideIconData | null = null;

	@Input() label: string = "";
	@Input() placeholder: string = "";
	@Input() type: string = "text";
	@Input() customErrors: Record<string, string> = {};
	@Input() min: number | null = null;
	@Input() max: number | null = null;
	@Input() maxLen: number | null = null;
	@Input() isBlocked: boolean = false;

	control = input.required<AbstractControl>();

	// Errors

	// Mensajes por defecto para toda la aplicación
	private defaultErrors: Record<string, string> = {
		required: "Este campo es obligatorio.",
		email: "El formato del correo no es válido.",
		pattern: "El formato ingresado es incorrecto.",
		minlength: "El texto es demasiado corto.",
		maxlength: "Ha excedido el límite de caracteres."
	};

	// Lógica de ControlValueAccessor
	value = signal<any>("");
	disabled = computed(() => this.isBlocked);
	onChange: any = () => {};
	onTouched: any = () => {};
	

	writeValue(val: any): void {
		this.value.set(val);
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	handleInput(event: Event): void {
		const val = (event.target as HTMLInputElement).value;
		this.value.set(val);
		this.onChange(val);
	}

	errorMessage = () => {
		const ctrl: AbstractControl = this.control();

		if (!ctrl?.errors || !ctrl.touched) return null;

		const errorKey = Object.keys(ctrl.errors)[0];

		return (
			this.customErrors[errorKey] ||
			this.defaultErrors[errorKey] ||
			"Campo inválido."
		);
	};
}
