import { Component } from "@angular/core";
import { AdminModalService } from "../../shared/admin-modal/admin-modal-service";
import { AdminNav } from "./components/navigation/admin-nav";
import { AdminSidenav } from "./components/sidenav/admin-sidenav";
import { ToggleSidenavService } from "./services/toggle-sidenav-service";

@Component({
	selector: "admin-login",
	templateUrl: "./admin-base-layout.html",
	standalone: true,
	imports: [AdminSidenav, AdminNav],
	providers: [ToggleSidenavService, AdminModalService],
})
export class AdminBaseLayout {}
