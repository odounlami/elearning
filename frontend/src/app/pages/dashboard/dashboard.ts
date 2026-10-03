import { AfterViewInit, Component, ElementRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CoursesService } from '../../core/courses/courses.service';
import { Course, Enrollment } from '../../shared/models/course';
import { ProgressBar } from '../../shared/components/progress-bar/progress-bar';
import { AuthService } from '../../core/auth/auth.service';
import { revealPage } from '../../shared/utils/page-motion';

@Component({imports:[RouterLink,ProgressBar,FormsModule],templateUrl:'./dashboard.html'})
export class Dashboard implements AfterViewInit {
  private readonly service=inject(CoursesService); readonly auth=inject(AuthService); private readonly host=inject(ElementRef<HTMLElement>);
  readonly items=signal<Enrollment[]>([]);
  readonly favorites=signal<Course[]>([]);
  search='';
  libraryFilter: 'all' | 'favorites' = 'all';
  constructor(){
    this.service.library().subscribe(x=>this.items.set(x));
    this.service.favorites().subscribe(x=>this.favorites.set(x));
  }
  ngAfterViewInit(){revealPage(this.host);}
  get filteredLibraryItems(): Enrollment[] {
    const term = this.search.trim().toLowerCase();
    const favoriteIds = new Set(this.favorites().map((course) => course.id));
    return this.items().filter(({ course }) => {
      const matchesSearch = !term || (course.title + ' ' + course.instructor).toLowerCase().includes(term);
      const matchesFilter = this.libraryFilter === 'all' || favoriteIds.has(course.id);
      return matchesSearch && matchesFilter;
    });
  }
}