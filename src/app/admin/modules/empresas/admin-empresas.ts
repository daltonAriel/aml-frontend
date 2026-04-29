/** biome-ignore-all lint/style/noNonNullAssertion: <> */

import { CommonModule } from "@angular/common";
import {
	Component,
	DestroyRef,
	inject,
	type OnInit,
	signal,
	type WritableSignal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import type { ApiResponse } from "@config/apiResponse";
import type { PageInterface } from "@interfaces/page-interface";
import { NgxSonnerToaster, toast } from "ngx-sonner";
import {
	debounceTime,
	distinctUntilChanged,
	finalize,
	startWith,
	tap,
} from "rxjs";
import { AdminPaginator } from "../../shared/admin-paginator/admin-paginator";
import { AdminTableLoader } from "../../shared/admin-table-loader/admin-table-loader";
import type { EmpresaInterface } from "./interfaces/empresa-interface";
import { AdminEmpresasService } from "./services/admin-empresas-service";

@Component({
	standalone: true,
	selector: "admin-empresas",
	templateUrl: "./admin-empresas.html",
	imports: [
		AdminPaginator,
		AdminTableLoader,
		CommonModule,
		ReactiveFormsModule,
		NgxSonnerToaster,
	],
	providers: [AdminEmpresasService],
})
export class AdminEmpresas implements OnInit {
	private destroyRef = inject(DestroyRef);
	empresaService: AdminEmpresasService = inject(AdminEmpresasService);
	private readonly toast = toast;

	filtro = new FormControl("");

	// Data
	empresas: WritableSignal<EmpresaInterface[]> = signal<EmpresaInterface[]>([]);
	isLoading: WritableSignal<boolean> = signal(true);

	// Paginacion
	totalElements: WritableSignal<number> = signal(10);
	totalPages: WritableSignal<number> = signal(5);
	page: WritableSignal<number> = signal(0);
	size: WritableSignal<number> = signal(5);

	//estado = signal<boolean | null>(null);
	sortBy = signal<string | null>(null);
	sortDir = signal<"asc" | "desc" | null>(null);

	ngOnInit(): void {
		this.filtro.valueChanges
			.pipe(
				tap(() => this.isLoading.set(true)),
				debounceTime(400),
				distinctUntilChanged(),
				startWith(this.filtro.value),
				takeUntilDestroyed(this.destroyRef),
			)
			.subscribe(() => {
				this.buscarEmpresas();
			});
	}

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
					this.toast.error('Error al buscar empresas');
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
