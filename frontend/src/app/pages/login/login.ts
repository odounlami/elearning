import { AfterViewInit, Component, ElementRef, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { getAuthErrorMessage } from '../../core/auth/auth-error';
import { revealPage } from '../../shared/utils/page-motion';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login implements AfterViewInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  error = '';
  loading = false;

  ngAfterViewInit() {
    revealPage(this.host);
  }

  submit() {
    this.error = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { email, password } = this.form.getRawValue();

    this.auth.login(email.trim(), password).pipe(
      finalize(() => (this.loading = false)),
    ).subscribe({
      next: () => {
        const pending = localStorage.getItem('elearning_pending_course');
        localStorage.removeItem('elearning_pending_course');
        void this.router.navigateByUrl(
          this.route.snapshot.queryParamMap.get('returnUrl') ||
          (pending ? `/courses/${pending}` : '/dashboard'),
        );
      },
      error: (error: unknown) => {
        this.error = getAuthErrorMessage(error, 'login');
      },
    });
  }
}
