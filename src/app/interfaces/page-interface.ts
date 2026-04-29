export interface PageInterface<T> {
	content: T[];
	totalElements: number;
	totalPages: number;
	size: number;
	number: number;
	numberOfElements: number;
	first: boolean;
	last: boolean;
	empty: boolean;
	pageable: any; // Puedes detallarlo más si necesitas offset/sort
	sort: any;
	pageNumber: number;
}
