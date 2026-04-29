/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
// biome-ignore assist/source/organizeImports: <>
import {
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  Input,
  input,
  signal,
  ViewChild,
} from "@angular/core";
import type { AbstractControl, ControlValueAccessor } from "@angular/forms";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { ChevronDown, LucideAngularModule } from "lucide-angular";

@Component({
  standalone: true,
  selector: "admin-select-color",
  templateUrl: "./admin-select-color.html",
  imports: [LucideAngularModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AdminSelectColor),
      multi: true,
    },
  ],
})
export class AdminSelectColor implements ControlValueAccessor {
  private el = inject(ElementRef);

  ChevronDown = ChevronDown;

  @Input() label: string = "Color de tema";
  @Input() placeholder: string = "Seleccione un color...";
  @Input() set isBlocked(value: boolean) {
    this.disabled.set(value);
    if (value) this.isOpen.set(false);
  }

  control = input.required<AbstractControl>();

  disabled = signal(false);

  // Estados con Signals
  isOpen = signal(false);
  searchTerm = signal("");
  selectedValue = signal<any>(null);

  // --- ControlValueAccessor ---
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(val: any): void {
    if (val) {
      this.selectedValue.set(val);
      this.hexValue.set(val.toUpperCase());
      this.updateHsvFromHex(val);
    } else {
      this.hexValue.set("");
      this.selectedValue.set("");
    }
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

  // Referencias del DOM
  @ViewChild("colorArea") colorArea!: ElementRef<HTMLDivElement>;

  isDragging = false;

  hexValue = signal<string>("");

  hue = signal<number>(231);
  saturation = signal<number>(65);
  brightness = signal<number>(71);

  // Colores predefinidos basados en tu imagen
  presets = [
    "#000000",
    "#FFFFFF",
    "#EF4444",
    "#84CC16",
    "#3B82F6",
    "#EAB308",
    "#D946EF",
    "#67E8F9",
    "#737373",
    "#7F1D1D",
    "#15803D",
    "#1E3A8A",
    "#A16207",
    "#701A75",
    "#2E8B57",
  ];

  // --- INTERACCIÓN CON EL ÁREA 2D ---
  onAreaMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.updateFromCoordinates(event);
  }

  @HostListener("document:mousemove", ["$event"])
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      this.updateFromCoordinates(event);
    }
  }

  @HostListener("document:mouseup")
  onMouseUp() {
    this.isDragging = false;
  }

  private updateFromCoordinates(event: MouseEvent) {
    if (!this.colorArea) return;
    const rect = this.colorArea.nativeElement.getBoundingClientRect();

    // Limitar las coordenadas dentro del cuadro
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(event.clientY - rect.top, rect.height));

    // Convertir a porcentajes
    this.saturation.set(Math.round((x / rect.width) * 100));
    this.brightness.set(Math.round((1 - y / rect.height) * 100));

    this.updateHexFromHsv();
    this.onChange(this.selectedValue());
  }

  // --- INTERACCIÓN CON LOS CONTROLES ---
  onHueChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.hue.set(Number(target.value));
    this.updateHexFromHsv();
    this.onChange(this.selectedValue());
  }

  onHexInput(event: Event) {
    const target = event.target as HTMLInputElement;
    let value = target.value.toUpperCase();

    value = value.replace(/[^0-9A-F#]/g, "");

    if (value.length > 0 && !value.startsWith("#")) {
      value = `#${value}`;
    }

    if (value.length > 7) {
      value = value.substring(0, 7);
    }

    target.value = value;

    const validHexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (validHexRegex.test(value)) {
      this.updateHsvFromHex(value);
      this.updateForm(value);
    }
  }

  selectPreset(color: string) {
    const val = color.toUpperCase();
    this.updateHsvFromHex(val);
    this.updateForm(val);
  }

  clear() {
    this.hexValue.set("");
    this.selectedValue.set("");
    this.onChange(this.selectedValue());
  }

  private updateHexFromHsv() {
    const h = this.hue();
    const s = this.saturation() / 100;
    const v = this.brightness() / 100;

    const f = (n: number, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);

    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.padStart(2, "0"); // Asegura siempre 2 caracteres
    };

    const newHex = `#${toHex(f(5))}${toHex(f(3))}${toHex(f(1))}`.toUpperCase();

    this.hexValue.set(newHex);
    this.selectedValue.set(newHex);
    this.onChange(newHex);
  }

  private updateHsvFromHex(hex: string) {
    hex = hex.replace("#", "");
    if (hex.length !== 6) return;

    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;

    let h = 0;
    if (d !== 0) {
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else if (max === b) h = (r - g) / d + 4;
      h /= 6;
    }

    this.hue.set(Math.round(h * 360));
    this.saturation.set(max === 0 ? 0 : Math.round((d / max) * 100));
    this.brightness.set(Math.round(max * 100));
  }

  private updateForm(value: string) {
    this.selectedValue.set(value);
    this.hexValue.set(value);
    this.onChange(value);
    this.writeValue(value);
  }
}
