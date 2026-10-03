import { AfterViewInit, Component, ElementRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
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

  readonly error = signal('');
  readonly loading = signal(false);

  ngAfterViewInit() {
    revealPage(this.host);
  }

  submit() {
    this.error.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const { email, password } = this.form.getRawValue();

    this.auth.login(email.trim(), password).subscribe({
      next: (result) => {
        this.loading.set(false);

        if (!result.success) {
          this.error.set(result.message);
          return;
        }

        const pending = localStorage.getItem('elearning_pending_course');
        localStorage.removeItem('elearning_pending_course');
        void this.router.navigateByUrl(
          this.route.snapshot.queryParamMap.get('returnUrl') ||
          (pending ? `/courses/${pending}` : '/dashboard'),
        );
      },
    });
  }
}