import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import {
	ArrowUpRight,
	Building2,
	Globe,
	LucideAngularModule,
	Mail,
	MapPin,
	Palette,
	Phone,
	Users,
} from "lucide-angular";
import { AdminEmpresasTransacciones } from "./graficas/empresas-transacciones/admin-empresas-transaccions";
import { AdminGraficaUsuariosArea } from "./graficas/usuarios-areas/admin-grafica-usuarios-areas";

@Component({
  standalone: true,
  selector: "admin-empresa-dashboard",
  templateUrl: "./admin-empresa-dashboard.html",
  imports: [RouterLink, LucideAngularModule, AdminGraficaUsuariosArea, AdminEmpresasTransacciones],
  providers: [],
})
export class AdminEmpresaDashboard {
  MapPin = MapPin;
  Phone = Phone;
  Globe = Globe;
  Mail = Mail;
  Building2 = Building2;
  ArrowUpRight = ArrowUpRight;
  Users = Users;
  Palette = Palette;
}
