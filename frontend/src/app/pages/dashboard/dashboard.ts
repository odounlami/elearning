import { AfterViewInit, Component, ElementRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CoursesService } from '../../core/courses/courses.service';
import { Course, Enrollment } from '../../shared/models/course';
import { CourseCard } from '../../shared/components/course-card/course-card';
import { ProgressBar } from '../../shared/components/progress-bar/progress-bar';
import { AuthService } from '../../core/auth/auth.service';
import { revealPage } from '../../shared/utils/page-motion';

@Component({imports:[RouterLink,ProgressBar,FormsModule,CourseCard],templateUrl:'./dashboard.html'})
export class Dashboard implements AfterViewInit {
  private readonly service=inject(CoursesService); readonly auth=inject(AuthService); private readonly host=inject(ElementRef<HTMLElement>);
  readonly items=signal<Enrollment[]>([]);
  readonly favorites=signal<Course[]>([]);
  search='';
  constructor(){
    this.service.library().subscribe(x=>this.items.set(x));
    this.service.favorites().subscribe(x=>this.favorites.set(x));
  }
  ngAfterViewInit(){revealPage(this.host);}
  get favoriteOnly(): Course[] {
    return this.favorites();
  }

  get filteredFavorites(): Course[] {
    const term = this.search.trim().toLowerCase();
    if (!term) return this.favoriteOnly;
    return this.favoriteOnly.filter((course) =>
      (course.title + ' ' + course.instructor).toLowerCase().includes(term),
    );
  }

  get filteredItems(): Enrollment[] {
    const term = this.search.trim().toLowerCase();
    if (!term) return this.items();
    return this.items().filter(({ course }) =>
      (course.title + ' ' + course.instructor).toLowerCase().includes(term),
    );
  }
}
