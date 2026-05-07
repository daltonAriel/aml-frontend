import { Component } from "@angular/core";
import { AppUsuarioNavbar } from "./navbar/app-user-navbar";
import { AppUsuarioSidenav } from "./sidenav/app-usuario-sidenav";

@Component({
    standalone: true,
    selector: 'app-usuario-base',
    templateUrl: './app-usuario-base.html',
    imports: [AppUsuarioSidenav, AppUsuarioNavbar],
    providers: []
})
export class AppUsuarioBase {

}
