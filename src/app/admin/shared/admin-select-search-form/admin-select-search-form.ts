/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import { CommonModule } from "@angular/common";
import {
	Component,
	computed,
	ElementRef,
	EventEmitter,
	forwardRef,
	HostListener,
	inject,
	Input,
	input,
	Output,
	signal,
} from "@angular/core";
import {
	type AbstractControl,
	type ControlValueAccessor,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from "@angular/forms";
import {
	Check,
	ChevronDown,
	LucideAngularModule,
	type LucideIconData,
	Search,
} from "lucide-angular";

export interface SelectOption {
	label: string;
	value: string;
}

@Component({
	selector: "admin-select-search-form",
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => BaseSelectComponent),
			multi: true,
		},
	],
	templateUrl: "./admin-select-search-form.html",
})
export class BaseSelectComponent implements ControlValueAccessor {
	private el = inject(ElementRef);

	ChevronDown = ChevronDown;
	Search = Search;
	Check = Check;
	@Input() FileIcon: LucideIconData | null = null;

	@Input() label: string = "";
	@Input() placeholder: string = "Seleccione una opción...";
	@Input() set isBlocked(value: boolean) {
		this.disabled.set(value);
		if (value) this.isOpen.set(false);
	}

	@Output() onChangeSelection = new EventEmitter<string>();

	options = input<SelectOption[]>([]);

	control = input.required<AbstractControl>();
	disabled = signal(false);

	// Estados con Signals
	isOpen = signal(false);
	searchTerm = signal("");
	selectedValue = signal<any>(null);

	private defaultErrors: Record<string, string> = {
		required: "Este campo es obligatorio.",
		email: "El formato del correo no es válido.",
		pattern: "El formato ingresado es incorrecto.",
		minlength: "El texto es demasiado corto.",
		maxlength: "Ha excedido el límite de caracteres.",
	};

	// Filtro dinámico
	filteredOptions = computed(() => {
		const term = this.searchTerm().toLowerCase();
		return this.options().filter((opt) =>
			opt.label.toLowerCase().includes(term),
		);
	});

	// Etiqueta del item seleccionado para mostrar en el botón
	selectedLabel = computed(() => {
		const selected = this.options().find(
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

	toggleDropdown() {
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
		this.onChangeSelection.emit(option.value);
		this.selectedValue.set(option.value);
		this.onChange(option.value);
		this.isOpen.set(false);
		this.onTouched();
	}

	getSelectedLabel(): string | null {
		const selected = this.options().find(
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
