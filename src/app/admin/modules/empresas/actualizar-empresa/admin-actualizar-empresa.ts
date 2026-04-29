/** biome-ignore-all lint/style/noNonNullAssertion: <> */
import { CommonModule } from "@angular/common";
import { Component, inject, type OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  type FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import type { ApiResponse } from "@config/apiResponse";
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
import type { EmpresaDireccionesInterface } from "../interfaces/empresa-interface";
import { AdminEmpresasService } from "../services/admin-empresas-service";
import { AdminEmpresaAsyncValidators } from "../validators/empresa-async-validators";

@Component({
	standalone: true,
	selector: "app-admin-actualizar-empresa",
	templateUrl: "./admin-actualizar-empresa.html",
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
export class AdminActualizarEmpresa implements OnInit {
	ngOnInit(): void {
    this.getEmpresa();
  }

	private activatedRoute = inject(ActivatedRoute);
	private readonly _empresaId =
	this.activatedRoute.snapshot.paramMap.get("empresaId");
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
			[AdminEmpresaAsyncValidators.codigoUnicoEmpresaId(this.empresaService, this._empresaId!)],
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
			[AdminEmpresaAsyncValidators.nombreUnicoEmpresaId(this.empresaService, this._empresaId!)],
		],
		empresaSiglas: [""],
		parroquiaId: ["", [Validators.required, CustomValidators.isNotEmpty]],
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

	actualizarEmpresa() {
		if (this.empresaForm.invalid) {
			this.empresaForm.markAllAsTouched();
			return;
		}
		this.isLoading.set(true);

		const data: CrearEmpresaInterface = this.empresaForm.getRawValue();
		this.empresaService
			.actualizarEmpresa(this._empresaId!, data)
			.pipe(finalize(() => this.isLoading.set(false)))
			.subscribe({
				next: () => {
					this.empresaForm.reset();
					this.toast.success("Empresa actualizada exitosamente");
				},
				error: (error) => {
					if (error.status !== 401) {
						this.toast.error("Error al actualizar la empresa");
					}
				},
			});
	}

	isInvalid(field: string) {
		const control = this.empresaForm.get(field);
		return control?.invalid && (control?.touched || control?.dirty);
	}

	onChangeProvincia($event: string) {
		this.getCantones($event);
		this.empresaForm.patchValue({ cantonId: "", parroquiaId: "" });
	}

	onChangeCanton($event: string) {
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
			error: () => {
				this.toast.error("Error al cargar las provincias");
			},
		});
	}

	getCantones(provinciaId: string) {
		this.adminCantonService.buscarCantonesProvinciaId(provinciaId).subscribe({
			next: (response) => {
				const _cantones =
					response.data?.map((canton) => ({
						label: canton.cantonNombre,
						value: canton.cantonId,
					})) ?? [];
				this.cantones.set(_cantones);
			},
			error: () => {
				this.toast.error("Error al cargar los cantones");
			},
		});
	}

	getParroquias(cantonId: string) {
		this.adminParroquiaService.buscarParroquiasCantonId(cantonId).subscribe({
			next: (response) => {
				const _parroquias =
					response.data?.map((parroquia) => ({
						label: parroquia.parroquiaNombre,
						value: parroquia.parroquiaId,
					})) ?? [];
				this.parroquias.set(_parroquias);
			},
			error: () => {
				this.toast.error("Error al cargar las parroquias");
			},
		});
	}

	getEmpresa() {
		this.isLoading.set(true);
		this.empresaService
			.buscarEmpresaPorIdDirecciones(this._empresaId ?? "error")
			.pipe(finalize(() => this.isLoading.set(false)))
			.subscribe({
				next: (res: ApiResponse<EmpresaDireccionesInterface>) => {
          this.empresaForm.patchValue(res.data!);
          this.getProvinias();
          this.getCantones(res.data!.provinciaId);
          this.getParroquias(res.data!.cantonId);
        },
				error: () => {
					this.toast.error("Error al obtener los datos de la empresa");
				},
			});
	}
}
