import { Component, computed, inject } from "@angular/core";
import { ToggleSidenavService } from "../../services/toggle-sidenav-service";

@Component({
	standalone: true,
	selector: "admin-sidenav",
	templateUrl: "./admin-sidenav.html",
	providers: [],
})
export class AdminSidenav {
	private togleSidenavServide = inject(ToggleSidenavService);

	isCollapsed = computed(() => this.togleSidenavServide.navStatus());


	setOpen = () => this.togleSidenavServide.setExpanded();
}
