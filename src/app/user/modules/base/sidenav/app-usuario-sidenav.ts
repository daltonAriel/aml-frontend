import { NgClass } from "@angular/common";
import { Component, inject } from "@angular/core";
import { LucideDot, LucideShieldAlert, LucideUserCheck } from '@lucide/angular';
import { UsuarioTemaService } from "../../../services/usuario-tema-service";

@Component({
  standalone: true,
  selector: "app-usuario-sidenav",
  templateUrl: "./app-usuario-sidenav.html",
  imports: [NgClass,
    LucideUserCheck,
    LucideDot, 
    LucideShieldAlert
  ],
  providers: [
  ],
})
export class AppUsuarioSidenav {
  readonly temaService  = inject(UsuarioTemaService)

}
