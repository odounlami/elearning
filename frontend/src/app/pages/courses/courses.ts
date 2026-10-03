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
  language = 'ALL';
  page = 1;
  readonly pageSize = 9;

  constructor() {
    this.service.list().subscribe((courses) => this.all.set(courses));
    if (this.auth.isAuthenticated()) {
      this.service.library().subscribe((items) => {
        this.libraryIds.set(new Set(items.map((item) => item.course.id)));
      });
    }
  }

  get languages(): string[] {
    return [...new Set(this.all().map((course) => course.language))].sort();
  }

  get filteredAll(): Course[] {
    const term = this.search.trim().toLowerCase();
    return this.all().filter((course) => {
      const matchesSearch = !term || `${course.title} ${course.instructor}`.toLowerCase().includes(term);
      return matchesSearch && (this.level === 'ALL' || course.level === this.level) && (this.language === 'ALL' || course.language === this.language);
    });
  }

  get filtered(): Course[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredAll.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredAll.length / this.pageSize));
  }

  get currentPage(): number {
    return Math.min(this.page, this.totalPages);
  }

  setPage(page: number): void {
    this.page = Math.max(1, Math.min(page, this.totalPages));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngAfterViewInit(): void {
    revealPage(this.host);
  }
}
