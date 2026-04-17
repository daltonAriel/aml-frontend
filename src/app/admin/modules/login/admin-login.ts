import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAtSign, LucideLockKeyhole } from '@lucide/angular';
import { NgxSonnerToaster, toast } from 'ngx-sonner';
import { finalize } from 'rxjs/operators';
import { ErrorLogin } from './components/error-login';
import { SpinnerComponent } from './components/spiner-loader';
import { AdminLoginHttpService } from './services/admin-login-http-service';

@Component({
  selector: 'admin-login',
  templateUrl: './admin-login.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    LucideAtSign,
    LucideLockKeyhole,
    ErrorLogin,
    NgxSonnerToaster,
    SpinnerComponent,
  ],
  providers: [AdminLoginHttpService],
})
export class Login {
  private fb = inject(FormBuilder);
  private loginHttpService = inject(AdminLoginHttpService);
  private readonly toast = toast;

  stattusHttpLogin = signal<boolean>(false);


  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    contrasena: ['', Validators.required],
  });

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.stattusHttpLogin.set(true);

    const credentials = this.loginForm.getRawValue();

    this.loginHttpService
      .login(credentials)
      .pipe(finalize(() => this.stattusHttpLogin.set(false)))
      .subscribe({
        error: (err) => {
          if (
            err.error.code === 'USER_NOT_FOUND' ||
            err.error.code === 'INVALID_PARAMS' ||
            err.error.code === 'INVALID_CREDENTIALS'
          ) {
            this.loginForm.controls.contrasena.setValue('');
            this.loginForm.markAllAsTouched();
            this.toast.error('Credenciales incorrectas');
          }
        },
      });
  }

  close() {
    console.log(this.stattusHttpLogin);
  }
}
