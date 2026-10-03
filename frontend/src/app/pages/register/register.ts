import { AfterViewInit, Component, ElementRef, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { revealPage } from '../../shared/utils/page-motion';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
})
export class Register implements AfterViewInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  error = '';
  loading = false;

  async submit() {
    this.error = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email, password, confirmPassword } = this.form.getRawValue();

    if (password !== confirmPassword) {
      this.form.controls.confirmPassword.markAsTouched();
      this.error = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.loading = true;

    const result = await firstValueFrom(
      this.auth.register(name.trim(), email.trim(), password),
    );

    this.loading = false;

    if (!result.success) {
      this.error = result.message;
      return;
    }

    const pending = localStorage.getItem('elearning_pending_course');
    localStorage.removeItem('elearning_pending_course');
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

    await this.router.navigateByUrl(
      returnUrl || (pending ? `/courses/${pending}` : '/dashboard'),
    );
  }
}