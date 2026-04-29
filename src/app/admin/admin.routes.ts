import type { Routes } from "@angular/router";

export const adminRoutes: Routes = [
  {
    path: "empresas",
    loadComponent: () => import("./modules/empresas/admin-empresas").then((c) => c.AdminEmpresas),
  },
  {
    path: "empresas/crear",
    loadComponent: () =>
      import("./modules/empresas/crear-empresa/crear-empresa").then((c) => c.CrearEmpresa),
  },
  {
    path: "empresas/:empresaId/editar",
    loadComponent: () =>
      import("./modules/empresas/actualizar-empresa/admin-actualizar-empresa").then((c) => c.AdminActualizarEmpresa),
  },
  {
    path: "empresas/:empresaId/tema",
    loadComponent: () =>
      import("./modules/empresa-tema/admin-empresa-tema").then((c) => c.AdminEmpresaTema),
  },
  {
    path: "empresas/:empresaId/dashboard",
    loadComponent: () =>
      import("./modules/empresa-dashboard/admin-empresa-dashboard").then(
        (c) => c.AdminEmpresaDashboard,
      ),
  },
];
