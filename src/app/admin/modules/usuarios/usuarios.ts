/** biome-ignore-all lint/style/noNonNullAssertion: <> */

import { CommonModule } from "@angular/common";
import {
    Component,
    inject,
    type OnInit,
    signal,
    type WritableSignal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import type { ApiResponse } from "@config/apiResponse";
import type { PageInterface } from "@interfaces/page-interface";
import { LucideAngularModule, Settings } from "lucide-angular";
import { NgxSonnerToaster, toast } from "ngx-sonner";
import { finalize } from "rxjs";
import { AdminPaginator } from "../../shared/admin-paginator/admin-paginator";
import { AdminTableLoader } from "../../shared/admin-table-loader/admin-table-loader";
import type { EmpresaInterface } from "../empresas/interfaces/empresa-interface";
import { AdminEmpresasService } from "../empresas/services/admin-empresas-service";

@Component({
	standalone: true,
	selector: "admin-usuarios",
	templateUrl: "./usuarios.html",
	imports: [
		CommonModule,
		AdminPaginator,
		ReactiveFormsModule,
		AdminTableLoader,
		NgxSonnerToaster,
		RouterLink,
		LucideAngularModule,
	],
	providers: [AdminEmpresasService],
})
export class Usuarios implements OnInit {
	ngOnInit(): void {}

    Settings = Settings;

	empresaService: AdminEmpresasService = inject(AdminEmpresasService);
	private readonly toast = toast;
	filtro = new FormControl("");

	totalElements: WritableSignal<number> = signal(10);
	totalPages: WritableSignal<number> = signal(5);
	page: WritableSignal<number> = signal(0);
	size: WritableSignal<number> = signal(5);

	//estado = signal<boolean | null>(null);
	sortBy = signal<string | null>(null);
	sortDir = signal<"asc" | "desc" | null>(null);

	// Data
	empresas: WritableSignal<EmpresaInterface[]> = signal<EmpresaInterface[]>([]);
	isLoading: WritableSignal<boolean> = signal(true);

	cambiarOrden(columna: string) {
		if (this.sortBy() === columna) {
			const nuevaDireccion = this.sortDir() === "asc" ? "desc" : "asc";
			this.sortDir.set(nuevaDireccion);
		} else {
			this.sortBy.set(columna);
			this.sortDir.set("asc");
		}

		this.page.set(0);

		this.buscarEmpresas();
	}

	buscarEmpresas() {
		this.isLoading.set(true);
		this.empresaService
			.buscarEmpresas(
				this.page(),
				this.size(),
				this.sortBy(),
				this.sortDir(),
				this.filtro.value,
			)
			.pipe(finalize(() => this.isLoading.set(false)))
			.subscribe({
				next: (res: ApiResponse<PageInterface<EmpresaInterface>>) => {
					this.empresas.set(res.data!.content);
					this.totalElements.set(res.data!.totalElements);
					this.totalPages.set(res.data!.totalPages);
					this.size.set(res.data!.size);
					this.page.set(res.data!.number);
					this.isLoading.set(false);
				},

				error: (err) => {
					this.toast.error("Error al buscar empresas");
				},
			});
	}

	changePage(page: number) {
		this.page.set(page);
		this.buscarEmpresas();
	}

	changeSize(size: number) {
		this.size.set(size);
		this.buscarEmpresas();
	}
}
