import type { Routes } from "@angular/router";

export const adminRoutes: Routes = [
    {
        path: "empresas",
        loadComponent: () =>
            import("./modules/empresas/admin-empresas").then((c) => c.AdminEmpresas),
    },
];
