/** biome-ignore-all lint/style/noNonNullAssertion: <> */
import { Component, inject, type OnInit, signal } from "@angular/core";
import {
	FormBuilder,
	type FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { environment } from "@config/enviroment";
import {
	Image,
	ImageIcon,
	Info,
	LucideAngularModule,
	Palette,
} from "lucide-angular";
import { NgxSonnerToaster, toast } from "ngx-sonner";
import { finalize } from "rxjs";
import { AdminForm } from "../../shared/admin-form/admin-form";
import { AdminSelectColor } from "../../shared/admin-select-color/admin-select-color";
import { SpinnerComponent } from "../login/components/spiner-loader";
import { AdminFileUpload } from "./components/admin-img-load-fomr/admin-img-load-form";
import type { ActualizarEmpresaTemaInterface } from "./interfaces/actualizar-empresa-tema-interface";
import { AdminEmpresaTemaService } from "./services/admin-empresa-tema-service";

@Component({
	standalone: true,
	selector: "app-admin-empresa-tema",
	templateUrl: "./admin-empresa-tema.html",
	imports: [
		LucideAngularModule,
		AdminSelectColor,
		FormsModule,
		ReactiveFormsModule,
		AdminFileUpload,
		SpinnerComponent,
		AdminForm,
		NgxSonnerToaster,
	],
	providers: [AdminEmpresaTemaService],
})
export class AdminEmpresaTema implements OnInit {
	ngOnInit(): void {
		this.obtenerTema();
	}

	Image = Image;
	Info = Info;
	ImageIcon = ImageIcon;
	Palette = Palette;
	logoUrl = signal<string>("");

	private readonly toast = toast;
	private empresaTemaService = inject(AdminEmpresaTemaService);
	private activatedRoute = inject(ActivatedRoute);
	private readonly _empresaId =
		this.activatedRoute.snapshot.paramMap.get("empresaId");
	private _imgBaseUrl = environment.apiUrlResources;

	private fb = inject(FormBuilder);

	isLoading = signal<boolean>(false);
	isLoadingLogo = signal<boolean>(false);

	temaForm: FormGroup = this.fb.nonNullable.group({
		temaSlogan: ["", Validators.maxLength(250)],
		temaPrimary: ["", Validators.maxLength(7)],
		temaSecondary: ["", Validators.maxLength(7)],
		temaTertiary: ["", Validators.maxLength(7)],
	});

	obtenerTema() {
		if (this._empresaId == null) return;
		this.isLoading.set(true);
		this.empresaTemaService
			.obtenerTemaEmpresaId(this._empresaId!)
			.pipe(finalize(() => this.isLoading.set(false)))
			.subscribe({
				next: (res) => {
					this.temaForm.patchValue(res.data!);
					const _url = `${this._imgBaseUrl}/${res.data!.temaLogoUrl}`;
					this.logoUrl.set(_url);
				},
				error: () => {
					this.toast.error("Error al obtener el tema de la empresa");
				},
			});
	}

	actualizarTema() {
		if (this.temaForm.invalid) {
			this.temaForm.markAllAsTouched();
			return;
		}
		this.isLoading.set(true);
		const data: ActualizarEmpresaTemaInterface = this.temaForm.getRawValue();
		this.empresaTemaService
			.actualizarTemaEmpresaId(this._empresaId!, data)
			.pipe(finalize(() => this.isLoading.set(false)))
			.subscribe({
				next: (res) => {
					this.temaForm.patchValue(res.data!);
					this.toast.success("Tema actualizado exitosamente");
				},
				error: () => {
					this.toast.error("Error al actualizar el tema de la empresa");
				},
			});
	}

	eliminarImagen() {
		//////////
	}

	guardarImagen($image: File) {
		this.isLoadingLogo.set(true);
		this.empresaTemaService
			.actualizarLogo(this._empresaId!, $image)
			.pipe(finalize(() => this.isLoadingLogo.set(false)))
			.subscribe({
				next: (res) => {
					this.logoUrl.set(res.data!.temaLogoUrl!);
					this.toast.success("Logo actualizado exitosamente");
					this.obtenerTema();
				},
				error: () => {
					this.toast.error("Error al actualizar el logo de la empresa");
				},
			});
	}
}
