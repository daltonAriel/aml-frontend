/** biome-ignore-all lint/style/noNonNullAssertion: <> */

import { CommonModule } from "@angular/common";
import { Component, inject, type OnInit, signal } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import type { ApiResponse } from "@config/apiResponse";
import { environment } from "@config/enviroment";
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
import { NgxSonnerToaster, toast } from "ngx-sonner";
import { AdminEmpresasTransacciones } from "./graficas/empresas-transacciones/admin-empresas-transaccions";
import { AdminGraficaUsuariosArea } from "./graficas/usuarios-areas/admin-grafica-usuarios-areas";
import type { EmpresaDireccionesTemaInterface } from "./interfaces/empresa-direcciones-temas-interface";
import { AdminEmpresaDashboardService } from "./services/empresa-dashboard-service";

@Component({
  standalone: true,
  selector: "admin-empresa-dashboard",
  templateUrl: "./admin-empresa-dashboard.html",
  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule,
    AdminGraficaUsuariosArea,
    AdminEmpresasTransacciones,
    NgxSonnerToaster,
  ],
  providers: [AdminEmpresaDashboardService],
})
export class AdminEmpresaDashboard implements OnInit {
  MapPin = MapPin;
  Phone = Phone;
  Globe = Globe;
  Mail = Mail;
  Building2 = Building2;
  ArrowUpRight = ArrowUpRight;
  Users = Users;
  Palette = Palette;

  private readonly toast = toast;
  private empresaDashboardService = inject(AdminEmpresaDashboardService);
  private _imgBaseUrl = environment.apiUrlResources;
  datosEmpresa = signal<EmpresaDireccionesTemaInterface | undefined>(undefined);
  private activatedRoute = inject(ActivatedRoute);
  readonly _empresaId = this.activatedRoute.snapshot.paramMap.get("empresaId");

  ngOnInit(): void {
    this.buscarEmpresa();
  }

  buscarEmpresa() {
    this.empresaDashboardService
      .buscarEmpresaPorId(this._empresaId!)
      .pipe()
      .subscribe({
        next: (res: ApiResponse<EmpresaDireccionesTemaInterface>) => {
          const _data: EmpresaDireccionesTemaInterface | undefined = res.data;
          _data!.temaLogoUrl = `${this._imgBaseUrl}/${_data?.temaLogoUrl}`;
          this.datosEmpresa.set(_data!);
        },
        error: () => {
          this.toast.error("Error al obtener los datos de la empresa");
        },
      });
  }
}
