import { AfterViewInit, Component, ElementRef, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CoursesService } from '../../core/courses/courses.service';
import { AuthService } from '../../core/auth/auth.service';
import { Course } from '../../shared/models/course';
import { revealPage } from '../../shared/utils/page-motion';

@Component({ imports: [RouterLink, DecimalPipe], templateUrl: './course-detail.html' })
export class CourseDetail implements AfterViewInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(CoursesService);
  private readonly auth = inject(AuthService);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly course = signal<Course | null>(null);
  readonly favorite = signal(false);
  readonly favoriteBusy = signal(false);
  readonly visualVariant = computed(() => {
    const variants = ['bg-ink text-cream', 'bg-orange text-white', 'bg-amber text-ink', 'bg-paper-deep text-ink'];
    const id = this.course()?.id ?? 1;
    return variants[(id - 1) % variants.length];
  });
  enrolling = false;
  enrolled = false;
  libraryReady = !this.auth.isAuthenticated();

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const loadCourse = () => this.service.get(id).subscribe((course) => {
      this.course.set(course);
      this.favorite.set(!!course.isFavorite);
      const pending = localStorage.getItem('elearning_pending_course') === String(course.id);
      if (this.auth.isAuthenticated() && pending) {
        localStorage.removeItem('elearning_pending_course');
        this.enroll();
      }
    });

    if (this.auth.isAuthenticated()) {
      this.service.library().subscribe({
        next: (items) => { this.enrolled = items.some((item) => item.course.id === id); this.libraryReady = true; loadCourse(); },
        error: () => { this.libraryReady = true; loadCourse(); },
      });
    } else loadCourse();
  }

  ngAfterViewInit(): void { revealPage(this.host); }

  enroll(): void {
    const id = this.course()?.id;
    if (!id || this.enrolled || this.enrolling) return;
    if (!this.auth.isAuthenticated()) {
      localStorage.setItem('elearning_pending_course', String(id));
      void this.router.navigate(['/login'], { queryParams: { returnUrl: '/courses/' + id } });
      return;
    }
    this.enrolling = true;
    this.service.enroll(id).subscribe({
      next: () => { this.enrolled = true; this.enrolling = false; },
      error: () => { this.enrolling = false; },
    });
  }

  toggleFavorite(): void {
    const id = this.course()?.id;
    if (!id || this.favoriteBusy()) return;
    if (!this.auth.isAuthenticated()) {
      void this.router.navigate(['/login'], { queryParams: { returnUrl: '/courses/' + id } });
      return;
    }
    this.favoriteBusy.set(true);
    const request = this.favorite() ? this.service.unfavorite(id) : this.service.favorite(id);
    request.subscribe({
      next: (result) => { this.favorite.set(result.favorite); this.favoriteBusy.set(false); },
      error: () => this.favoriteBusy.set(false),
    });
  }
}
