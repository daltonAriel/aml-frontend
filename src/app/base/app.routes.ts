import type { Routes } from "@angular/router";

export const routes: Routes = [
	{
		path: "",
		loadComponent: () =>
			import("../admin/modules/login/admin-login").then((c) => c.Login),
	},
	{
		path: "admin-dashboard",
		
		loadComponent: () =>
			import("../admin/modules/base/admin-base-layout").then((c) => c.AdminBaseLayout),
			loadChildren: () => import("../admin/admin.routes").then((r) => r.adminRoutes),
	},
];
