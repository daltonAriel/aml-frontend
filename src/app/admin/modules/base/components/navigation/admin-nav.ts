import { Component, computed, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AdminSessionService } from "../../../../services/admin-session-service";
import { ToggleSidenavService } from "../../services/toggle-sidenav-service";

@Component({
	standalone: true,
	selector: "admin-nav",
	templateUrl: "./admin-nav.html",
	imports: [RouterModule],
	providers: [],
})
export class AdminNav {
	togleSidenavService = inject(ToggleSidenavService);
	sessionService = inject(AdminSessionService);

	toggleSidenav = () => this.togleSidenavService.updateStatus();

	nombreUsuario = computed<string>(() => this.sessionService.nombre());
	apellidoUsuario = computed<string>(() => this.sessionService.apellido());
	rolDescripcion = computed<string>(() => this.sessionService.rolDescripcion());

	iniciales = computed(() => {
		const n = this.nombreUsuario()?.charAt(0) || "";
		const a = this.apellidoUsuario()?.charAt(0) || "";
		const logic = (n + a).toUpperCase();
		return logic || "??";
	});
}

