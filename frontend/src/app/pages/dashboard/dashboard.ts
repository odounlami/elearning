import { AfterViewInit, Component, ElementRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CoursesService } from '../../core/courses/courses.service';
import { Course, Enrollment, Level } from '../../shared/models/course';
import { ProgressBar } from '../../shared/components/progress-bar/progress-bar';
import { AuthService } from '../../core/auth/auth.service';
import { revealPage } from '../../shared/utils/page-motion';

@Component({imports:[RouterLink,ProgressBar,FormsModule],templateUrl:'./dashboard.html'})
export class Dashboard implements AfterViewInit {
  private readonly service=inject(CoursesService); readonly auth=inject(AuthService); private readonly host=inject(ElementRef<HTMLElement>);
  readonly items=signal<Enrollment[]>([]);
  readonly favorites=signal<Course[]>([]);
  readonly loading=signal(true);
  search='';
  libraryFilter: 'all' | 'favorites' = 'all';
  levelFilter: 'all' | Level = 'all';
  sortBy: 'recent' | 'title' | 'progress' = 'recent';
  page = 1;
  readonly pageSize = 12;
  private loaded = 0;
  constructor(){
    this.service.library().subscribe({
      next: x => { this.items.set(x); this.finishLoading(); },
      error: () => this.finishLoading(),
    });
    this.service.favorites().subscribe({
      next: x => { this.favorites.set(x); this.finishLoading(); },
      error: () => this.finishLoading(),
    });
  }
  private finishLoading(): void {
    this.loaded += 1;
    if (this.loaded >= 2) this.loading.set(false);
  }
  ngAfterViewInit(){revealPage(this.host);}
  get matchingLibraryItems(): Enrollment[] {
    const term = this.search.trim().toLowerCase();
    const favoriteIds = new Set(this.favorites().map((course) => course.id));
    const filtered = this.items().filter(({ course }) => {
      const matchesSearch = !term || (course.title + ' ' + course.instructor).toLowerCase().includes(term);
      const matchesFavorite = this.libraryFilter === 'all' || favoriteIds.has(course.id);
      const matchesLevel = this.levelFilter === 'all' || course.level === this.levelFilter;
      return matchesSearch && matchesFavorite && matchesLevel;
    });

    return [...filtered].sort((a, b) => {
      if (this.sortBy === 'title') return a.course.title.localeCompare(b.course.title, 'fr');
      if (this.sortBy === 'progress') return b.progress - a.progress;
      return b.course.id - a.course.id;
    });
  }

  get filteredLibraryItems(): Enrollment[] {
    const start = (this.page - 1) * this.pageSize;
    return this.matchingLibraryItems.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.matchingLibraryItems.length / this.pageSize));
  }

  get currentPage(): number {
    return Math.min(this.page, this.totalPages);
  }

  get hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  get hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  getLevelLabel(level: Level): string {
    return level === 'BEGINNER' ? 'Débutant' : level === 'INTERMEDIATE' ? 'Intermédiaire' : 'Avancé';
  }

  isFavorite(courseId: number): boolean {
    return this.favorites().some((course) => course.id === courseId);
  }

  actionLabel(item: Enrollment): string {
    if (item.progress >= 100) return 'Revoir →';
    if (item.progress > 0) return 'Continuer →';
    return 'Commencer →';
  }

  actionModuleId(item: Enrollment): number {
    if (item.progress >= 100) return item.course.modules[0]?.id ?? 0;
    const completed = new Set(item.completedModuleIds);
    return item.course.modules.find((module) => !completed.has(module.id))?.id ?? item.course.modules[0]?.id ?? 0;
  }

  setPage(page: number): void {
    this.page = Math.max(1, Math.min(page, this.totalPages));
  }
}