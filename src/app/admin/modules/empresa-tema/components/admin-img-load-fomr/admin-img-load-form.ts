/** biome-ignore-all lint/suspicious/noExplicitAny: <Use not null> */
import {
  Component,
  computed,
  type ElementRef,
  EventEmitter,
  Input,
  Output,
  signal,
  ViewChild,
} from "@angular/core";
import { validateRealImageType } from "@validators/image-validation";
import { LucideAngularModule, Save, Trash2, Upload, X } from "lucide-angular";
import { NgxSonnerToaster, toast } from "ngx-sonner";

@Component({
  standalone: true,
  selector: "admin-img-load-form",
  templateUrl: "./admin-img-load-form.html",
  imports: [LucideAngularModule, NgxSonnerToaster],
})
export class AdminFileUpload {
  private readonly toast = toast;

  Upload = Upload;
  X = X;
  Save = Save;
  Trash2 = Trash2;

  @Input() label: string = "Imagen de logo";
  @Input() placeholder: string = "PNG o JPG (máx. 3MB)";

	@Input() set isBlocked(value: boolean) {
		this.disabled.set(value);
	}

  disabled = signal(false);

  // Recibimos la URL desde la base de datos
  @Input() set initialUrl(url: string | null | undefined) {
    if (url) {
      this.dbUrl.set(url);
      this.previewUrl.set(url);
      this.fileName.set("Imagen actual");
    } else {
      this.dbUrl.set(null);
      this.previewUrl.set(null);
      this.fileName.set(null);
    }
  }

  // Emite el archivo físico para que tu servicio de Angular llame al POST/PUT
  @Output() onSave = new EventEmitter<File>();

  // Emite TRUE si debes llamar a la API para borrar en BD, FALSE si solo limpió el input local
  @Output() onDelete = new EventEmitter<boolean>();

  // Estados reactivos
  dbUrl = signal<string | null>(null);
  previewUrl = signal<string | null>(null);
  fileName = signal<string | null>(null);
  selectedFile = signal<File | null>(null);
  isDragging = signal(false);

  @ViewChild("fileInput") fileInput!: ElementRef<HTMLInputElement>;

  // Señales computadas para saber en qué estado nos encontramos
  hasNewFile = computed(() => this.selectedFile() !== null);
  hasDbImage = computed(() => this.dbUrl() !== null);

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.processFile(file);
  }

  private async processFile(file: File) {
    if (!file) return;
    const maxSizeInBytes = 3 * 1024 * 1024;

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      //alert("Solo se permiten archivos JPG y PNG");
      this.toast.error("Solo se permiten archivos JPG y PNG");
      return;
    }

    if (file.size > maxSizeInBytes) {
      this.toast.error("Archivo demasiado grande", {
        description: `El tamaño máximo permitido es de 3MB. Tu archivo pesa ${(file.size / (1024 * 1024)).toFixed(2)}MB.`,
      });
      return;
    }

    const isValidImage = await validateRealImageType(file);
    if (!isValidImage) {
      this.toast.error("Archivo corrupto o inválido", {
        description: "El contenido del archivo no coincide con una imagen JPG o PNG.",
      });
      if (this.fileInput) this.fileInput.nativeElement.value = "";
      return;
    }

    this.selectedFile.set(file);
    this.fileName.set(file.name);

    // Leer para previsualizar localmente
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  // Eventos de Drag & Drop
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave() {
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.processFile(file);
  }

  //Botones
  onSaveImage() {
    const file = this.selectedFile();
    if (file) {
      this.onSave.emit(file);
    }
  }

  onDeleteImage() {
    if (this.hasNewFile()) {
      this.selectedFile.set(null);
      this.previewUrl.set(this.dbUrl());
      this.fileName.set(this.dbUrl() ? "Imagen actual (Base de datos)" : null);
      if (this.fileInput) this.fileInput.nativeElement.value = "";
    } else if (this.hasDbImage()) {
      this.onDelete.emit(true);
    }
  }

}
