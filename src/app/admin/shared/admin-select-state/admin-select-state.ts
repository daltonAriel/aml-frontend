/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import {
	Component,
	computed,
	ElementRef,
	forwardRef,
	HostListener,
	inject,
	Input,
	input,
	signal,
} from "@angular/core";
import {
	type AbstractControl,
	type ControlValueAccessor,
	NG_VALUE_ACCESSOR,
} from "@angular/forms";
import {
	Check,
	ChevronDown,
	LucideAngularModule,
	type LucideIconData,
} from "lucide-angular";

export interface SelectOption {
	label: string;
	value: boolean;
}

@Component({
	standalone: true,
	selector: "admin-select-state",
	templateUrl: "./admin-select-state.html",
	imports: [LucideAngularModule],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => AdminSelectState),
			multi: true,
		},
	],
})
export class AdminSelectState implements ControlValueAccessor {
	private el = inject(ElementRef);

	ChevronDown = ChevronDown;
	Check = Check;
	@Input() FileIcon: LucideIconData | null = null;

	@Input() label: string = "";
	@Input() placeholder: string = "Seleccione una opción...";
	@Input() set isBlocked(value: boolean) {
		this.disabled.set(value);
		if (value) this.isOpen.set(false);
	}

	@Input() options: SelectOption[] = [
		{ label: "Activo", value: true },
		{ label: "Inactivo", value: false },
	];

	control = input.required<AbstractControl>();
	disabled = signal(false);

	// Estados con Signals
	isOpen = signal(false);
	searchTerm = signal("");
	selectedValue = signal<any>(null);

	private defaultErrors: Record<string, string> = {
		required: "Este campo es obligatorio.",
	};

	// Filtro dinámico
	getOptions = computed(() => {
		return this.options;
	});

	// Etiqueta del item seleccionado para mostrar en el botón
	selectedLabel = computed(() => {
		const selected = this.options.find(
			(opt) => opt.value === this.selectedValue(),
		);
		return selected ? selected.label : this.placeholder;
	});

	// --- ControlValueAccessor ---
	onChange: any = () => {};
	onTouched: any = () => {};

	writeValue(val: any): void {
		this.selectedValue.set(val);
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	toggleDropdown(event: MouseEvent) {
		if (this.disabled()) return;
		this.isOpen.update((v) => !v);
		if (this.isOpen()) {
			this.searchTerm.set("");
		}
	}

	closeDropdown() {
		this.isOpen.set(false);
		this.onTouched();
	}

	@HostListener("document:click", ["$event"])
	handleClickOutside(event: MouseEvent) {
		if (!this.isOpen()) return;

		const target = event.target as HTMLElement;

		if (!this.el.nativeElement.contains(target)) {
			this.closeDropdown();
		}
	}

	// Cerrar dropdown con Escape
	@HostListener("document:keydown.escape")
	handleEscape() {
		this.closeDropdown();
	}

	selectOption(option: SelectOption) {
		this.selectedValue.set(option.value);
		this.onChange(option.value);
		this.isOpen.set(false);
		this.onTouched();
	}

	getSelectedLabel(): string | null {
		const selected = this.options.find(
			(opt) => opt.value === this.selectedValue(),
		);
		return selected ? selected.label : null;
	}

	errorMessage = () => {
		const ctrl: AbstractControl = this.control();
		if (!ctrl?.errors || !ctrl.touched) return null;
		const errorKey = Object.keys(ctrl.errors)[0];
		return this.defaultErrors[errorKey] || "Campo inválido.";
	};
}
