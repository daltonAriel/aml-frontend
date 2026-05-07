import { Component, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgxSonnerToaster, toast } from "ngx-sonner";
import { finalize } from "rxjs";
import { ErrorUserLogin } from "./components/error-user-login";
import { SpinnerUserLogin } from "./components/spinner-user-login";
import { UserLoginService } from "./services/user-login-service";

@Component({
  standalone: true,
  selector: "app-user-login",
  templateUrl: "./login.html",
  imports: [ReactiveFormsModule, NgxSonnerToaster, SpinnerUserLogin, ErrorUserLogin],
  providers: [UserLoginService],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private userLoginService = inject(UserLoginService);
  private readonly toast = toast;

  stattusHttpLogin = signal<boolean>(false);

  loginForm = this.fb.nonNullable.group({
    email: ["", [Validators.required, Validators.email]],
    contrasena: ["", Validators.required],
  });

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.stattusHttpLogin.set(true);
    const credentials = this.loginForm.getRawValue();
    this.userLoginService
      .login(credentials)
      .pipe(finalize(() => this.stattusHttpLogin.set(false)))
      .subscribe({
        next: (data) => {},
        error: (err) => {
          if (err.error.code === "TENANT_BLOCKED") {
            this.toast.error("Empresa Bloqueada, contacte al administrador");
            return;
          }
          if (err.error.code === "USER_DISABLED") {
            this.toast.error("Su cuenta esta desactivada, porfavor notifique al administrador");
            return;
          }
          if (
            err.error.code === "USER_NOT_FOUND" ||
            err.error.code === "INVALID_PARAMS" ||
            err.error.code === "INVALID_CREDENTIALS"
          ) {
            this.loginForm.controls.contrasena.setValue("");
            this.loginForm.markAllAsTouched();
            this.toast.error("Credenciales incorrectas");
          }
        },
      });
  }
}
