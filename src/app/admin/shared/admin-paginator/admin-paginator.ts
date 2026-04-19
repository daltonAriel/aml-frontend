import { Component, computed, input, output } from "@angular/core";

@Component({
	standalone: true,
	selector: "admin-paginator",
	templateUrl: "./admin-paginator.html",
	styleUrl: "./admin-paginator.scss",
	imports: [],
	providers: [],
})
export class AdminPaginator {
    // Valores de entrada
	totalElements = input.required<number>();
	totalPages = input.required<number>();
	currentPage = input<number>(0); // Indexado en 0 como Spring
	pageSize = input<number>(10);

	// Eventos de salida
	pageChange = output<number>();
	pageSizeChange = output<number>();
	
	
	startIndex = computed(() =>
		this.totalElements() === 0 ? 0 : this.currentPage() * this.pageSize() + 1,
	);
	endIndex = computed(() =>
		Math.min((this.currentPage() + 1) * this.pageSize(), this.totalElements()),
	);

    /**
     * Muestra un arreglo de elipsis y las paginas que se pueden mostrar
     */
	visiblePages = computed(() => {
		const total = this.totalPages();
		const current = this.currentPage() + 1;
		const pages: (number | string)[] = [];

		const range = 1;

		for (let i = 1; i <= total; i++) {
			if (
				i === 1 ||
				i === total ||
				i === 2 ||
				i === total - 1 ||
				(i >= current - range && i <= current + range)
			) {
				pages.push(i);
			} else if (pages[pages.length - 1] !== "...") {
				pages.push("...");
			}
		}
		return pages;
	});

	onPageClick(page: number | string) {
		if (typeof page === "number") {
			this.pageChange.emit(page - 1); // Emitimos en base 0 para el backend
		}
	}

	onSizeChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		this.pageSizeChange.emit(Number(select.value));
	}
}
