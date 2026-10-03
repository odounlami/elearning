import { AfterViewInit, Component, ElementRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CourseCard } from '../../shared/components/course-card/course-card';
import { Course, Level } from '../../shared/models/course';
import { CoursesService } from '../../core/courses/courses.service';
import { AuthService } from '../../core/auth/auth.service';
import { revealPage } from '../../shared/utils/page-motion';

@Component({
  imports: [FormsModule, CourseCard],
  templateUrl: './courses.html',
})
export class Courses implements AfterViewInit {
  private readonly service = inject(CoursesService);
  private readonly auth = inject(AuthService);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly all = signal<Course[]>([]);
  readonly libraryIds = signal<Set<number>>(new Set());

  search = '';
  level: 'ALL' | Level = 'ALL';
  domain = 'ALL';
  language = 'ALL';

  constructor() {
    this.service.list().subscribe((courses) => this.all.set(courses));

    if (this.auth.isAuthenticated()) {
      this.service.library().subscribe((items) => {
        this.libraryIds.set(new Set(items.map((item) => item.course.id)));
      });
    }
  }

  get domains(): string[] {
    return [...new Set(this.all().map((course) => course.domain))].sort();
  }

  get languages(): string[] {
    return [...new Set(this.all().map((course) => course.language))].sort();
  }

  get filtered(): Course[] {
    const term = this.search.trim().toLowerCase();

    return this.all().filter((course) => {
      const matchesSearch =
        !term ||
        `${course.title} ${course.description} ${course.instructor} ${course.domain}`
          .toLowerCase()
          .includes(term);

      return (
        matchesSearch &&
        (this.level === 'ALL' || course.level === this.level) &&
        (this.domain === 'ALL' || course.domain === this.domain) &&
        (this.language === 'ALL' || course.language === this.language)
      );
    });
  }

  ngAfterViewInit(): void {
    revealPage(this.host);
  }
}
