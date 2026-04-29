import { CommonModule } from "@angular/common";
import { Component, inject, type OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  type FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CustomValidators } from "@validators/custom-validators";
import {
  Building2,
  Globe,
  LucideAngularModule,
  Mail,
  MapIcon,
  Phone,
  Settings,
} from "lucide-angular";
import { NgxSonnerToaster, toast } from "ngx-sonner";
import { finalize } from "rxjs";
import { AdminForm } from "../../../shared/admin-form/admin-form";
import { BaseSelectComponent } from "../../../shared/admin-select-search-form/admin-select-search-form";
import { AdminSelectState } from "../../../shared/admin-select-state/admin-select-state";
import { AdminCantonService } from "../../cantones/services/admin-canton-service";
import { SpinnerComponent } from "../../login/components/spiner-loader";
import { AdminParroquiaService } from "../../parroquias/services/admin-parroquia-service";
import { AdminProvinciaService } from "../../provincias/services/admin-provincia-service";
import type { CrearEmpresaInterface } from "../interfaces/crear-empresa-interface";
import { AdminEmpresasService } from "../services/admin-empresas-service";
import { AdminEmpresaAsyncValidators } from "../validators/empresa-async-validators";

@Component({
	standalone: true,
	selector: "crear-empresa",
	templateUrl: "./crear-empresa.html",
	imports: [
		CommonModule,
		ReactiveFormsModule,
		AdminForm,
		LucideAngularModule,
		BaseSelectComponent,
		AdminSelectState,
		NgxSonnerToaster,
		SpinnerComponent,
	],
	providers: [
		AdminEmpresasService,
		AdminProvinciaService,
		AdminCantonService,
		AdminParroquiaService,
	],
})
export class CrearEmpresa implements OnInit {
	ngOnInit(): void {
		this.getProvinias();
	}
	private fb = inject(FormBuilder);
	private empresaService: AdminEmpresasService = inject(AdminEmpresasService);
	private adminProvinciaService: AdminProvinciaService = inject(
		AdminProvinciaService,
	);
	private adminCantonService: AdminCantonService = inject(AdminCantonService);
	private adminParroquiaService: AdminParroquiaService = inject(
		AdminParroquiaService,
	);
	private readonly toast = toast;

	Building2 = Building2;
	MapIcon = MapIcon;
	Phone = Phone;
	Globe = Globe;
	Mail = Mail;
	Settings = Settings;

	provincias = signal<{ label: string; value: string }[]>([]);
	cantones = signal<{ label: string; value: string }[]>([]);
	parroquias = signal<{ label: string; value: string }[]>([]);

	isLoading = signal<boolean>(false);

	empresaForm: FormGroup = this.fb.nonNullable.group({
		empresaCodigo: [
			"",
			[Validators.required],
			[AdminEmpresaAsyncValidators.codigoUnicoEmpresa(this.empresaService)],
		],
		empresaRuc: ["", [Validators.required, Validators.pattern("^[0-9]{13}$")]],
		empresaNombre: [
			"",
			[
				Validators.required,
				CustomValidators.isNotEmpty,
				Validators.minLength(3),
				Validators.maxLength(200),
			],
			[AdminEmpresaAsyncValidators.nombreUnicoEmpresa(this.empresaService)],
		],
		empresaSiglas: [""],
		parroquiaId: [
			"",
			[Validators.required, CustomValidators.isNotEmpty],
		],
		cantonId: ["", [Validators.required, CustomValidators.isNotEmpty]],
		provinciaId: ["", [Validators.required, CustomValidators.isNotEmpty]],
		empresaTelefono: [
			"",
			[
				Validators.required,
				CustomValidators.isNotEmpty,
				Validators.pattern("^[+]?[0-9]+$"),
				Validators.maxLength(13),
			],
		],
		empresaEmail: [
			"",
			[Validators.required, CustomValidators.isNotEmpty, Validators.email],
		],
		empresaWeb: [""],
		empresaEstado: [true, [Validators.required]],
	});

	guardarEmpresa() {
		if (this.empresaForm.invalid) {
			this.empresaForm.markAllAsTouched();
			return;
		}
		this.isLoading.set(true);

		const data: CrearEmpresaInterface = this.empresaForm.getRawValue();

		this.empresaService
			.guardarEmpresa(data)
			.pipe(finalize(() => this.isLoading.set(false)))
			.subscribe({
				next: () => {
					this.empresaForm.reset();
					this.toast.success("Empresa creada exitosamente");
				},

				error: (error) => {
					if (error.status !== 401) {
						this.toast.error("Error al crear la empresa");
					}
				},
			});
	}

	isInvalid(field: string) {
		const control = this.empresaForm.get(field);
		return control?.invalid && (control?.touched || control?.dirty);
	}

	onChangeProvincia($event: string) {
		console.log("Provincia seleccionada:", $event);
		this.getCantones($event);
		this.empresaForm.patchValue({ cantonId: "", parroquiaId: "" });
	}

	onChangeCanton($event: string) {
		console.log("Canton seleccionado:", $event);
		this.getParroquias($event);
		this.empresaForm.patchValue({ parroquiaId: "" });
	}

	getProvinias() {
		this.adminProvinciaService.buscarProvincias().subscribe({
			next: (response) => {
				const _provincias =
					response.data?.map((provincia) => ({
						label: provincia.provinciaNombre,
						value: provincia.provinciaId,
					})) ?? [];
				this.provincias.set(_provincias);
			},
			error: (error) => {
				console.error("Error al cargar provincias", error);
			},
		});
	}

	getCantones(provinciaId: string) {
		this.adminCantonService.buscarCantonesProvinciaId(provinciaId).subscribe({
			next: (response) => {
				console.log("Cantones cargados:", response.data);
				const _cantones =
					response.data?.map((canton) => ({
						label: canton.cantonNombre,
						value: canton.cantonId,
					})) ?? [];
				this.cantones.set(_cantones);
			},
			error: (error) => {
				console.error("Error al cargar cantones", error);
			},
		});
	}

	getParroquias(cantonId: string) {
    this.adminParroquiaService.buscarParroquiasCantonId(cantonId).subscribe({
      next: (response) => {
        console.log("Parroquias cargados:", response.data);
        const _parroquias =
          response.data?.map((parroquia) => ({
            label: parroquia.parroquiaNombre,
            value: parroquia.parroquiaId,
          })) ?? [];
        this.parroquias.set(_parroquias);
      },
      error: (error) => {
        console.error("Error al cargar parroquias", error);
      },
    }); 
  }
}
