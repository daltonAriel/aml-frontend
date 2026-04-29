import { Component, input } from "@angular/core";

@Component({
	standalone: true,
	selector: "admin-table-loader",
	templateUrl: "./admin-table-loader.html",
	imports: [],
	providers: [],
})
export class AdminTableLoader {
	enabled = input<boolean>(false);

	//changeStatus = computed(this.enabled);
}
