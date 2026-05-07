import { Component, computed, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { BetweenHorizontalStart, ChartLine, Landmark, LucideAngularModule, Users } from "lucide-angular";
import { ToggleSidenavService } from "../../services/toggle-sidenav-service";

@Component({
	standalone: true,
	selector: "admin-sidenav",
	templateUrl: "./admin-sidenav.html",
	imports: [LucideAngularModule, RouterLink],
	providers: [],
})
export class AdminSidenav {
	BetweenHorizontalStart = BetweenHorizontalStart;
	Landmark = Landmark;
	Users = Users;
	ChartLine = ChartLine;


	private togleSidenavServide = inject(ToggleSidenavService);

	isCollapsed = computed(() => this.togleSidenavServide.navStatus());


	setOpen = () => this.togleSidenavServide.setExpanded();
}
