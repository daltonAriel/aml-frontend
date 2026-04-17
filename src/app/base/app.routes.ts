import type { Routes } from "@angular/router";

export const routes: Routes = [
	{
		path: "",
		loadComponent: () =>
			import("../admin/modules/login/admin-login").then((c) => c.Login),
	},
];
