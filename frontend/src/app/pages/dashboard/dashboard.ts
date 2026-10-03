import { AfterViewInit, Component, ElementRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CoursesService } from '../../core/courses/courses.service';
import { Enrollment } from '../../shared/models/course';
import { ProgressBar } from '../../shared/components/progress-bar/progress-bar';
import { AuthService } from '../../core/auth/auth.service';
import { revealPage } from '../../shared/utils/page-motion';

@Component({imports:[RouterLink,ProgressBar],templateUrl:'./dashboard.html'})
export class Dashboard implements AfterViewInit {
  private readonly service=inject(CoursesService); readonly auth=inject(AuthService); private readonly host=inject(ElementRef<HTMLElement>);
  readonly items=signal<Enrollment[]>([]);
  constructor(){this.service.library().subscribe(x=>this.items.set(x));}
  ngAfterViewInit(){revealPage(this.host);}
}