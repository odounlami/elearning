import { AfterViewInit, Component, ElementRef, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CoursesService } from '../../core/courses/courses.service';
import { AuthService } from '../../core/auth/auth.service';
import { Course } from '../../shared/models/course';
import { revealPage } from '../../shared/utils/page-motion';

@Component({
  imports: [RouterLink, DecimalPipe],
  templateUrl: './course-detail.html',
})
export class CourseDetail implements AfterViewInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(CoursesService);
  private readonly auth = inject(AuthService);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly course = signal<Course | null>(null);
  enrolling = false;
  enrolled = false;

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.service.get(id).subscribe((course) => {
      this.course.set(course);

      if (
        this.auth.isAuthenticated() &&
        localStorage.getItem('elearning_pending_course') === String(course.id)
      ) {
        localStorage.removeItem('elearning_pending_course');
        this.enroll();
      }
    });

    if (this.auth.isAuthenticated()) {
      this.service.library().subscribe((items) => {
        this.enrolled = items.some((item) => item.course.id === id);
      });
    }
  }

  ngAfterViewInit(): void {
    revealPage(this.host);
  }

  enroll(): void {
    const id = this.course()?.id;
    if (!id) return;

    if (!this.auth.isAuthenticated()) {
      localStorage.setItem('elearning_pending_course', String(id));
      void this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/courses/' + id },
      });
      return;
    }

    if (this.enrolled) return;

    this.enrolling = true;

    this.service.enroll(id).subscribe({
      next: () => {
        this.enrolling = false;
        this.enrolled = true;
      },
      error: () => {
        this.enrolling = false;
      },
    });
  }
}
