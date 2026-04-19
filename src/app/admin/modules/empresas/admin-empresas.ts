import { Component } from "@angular/core";
import { AdminPaginator } from "../../shared/admin-paginator/admin-paginator";

@Component({
    standalone: true,
    selector: 'admin-empresas',
    templateUrl: './admin-empresas.html',
    imports: [AdminPaginator],
    providers: []
})
export class AdminEmpresas {
    

    cambiarPagina(event: number) {
        console.log(event);
    }

}