import { bootstrapApplication } from "@angular/platform-browser";
import { App } from "./app/base/app";
import { appConfig } from "./app/base/app.config";

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
