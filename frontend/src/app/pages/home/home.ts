import { AfterViewInit, Component, ElementRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CoursesService } from '../../core/courses/courses.service';
import { Course } from '../../shared/models/course';
import { CourseCard } from '../../shared/components/course-card/course-card';
import { floatBooks, revealPage } from '../../shared/utils/page-motion';

@Component({imports:[RouterLink,CourseCard],templateUrl:'./home.html'})
export class Home implements AfterViewInit {
  private readonly service=inject(CoursesService);
  private readonly host=inject(ElementRef<HTMLElement>);
  readonly courses=signal<Course[]>([]);

  constructor(){
    this.service.list().subscribe({next:c=>this.courses.set(c.slice(0,3)),error:()=>this.courses.set([])});
  }

  ngAfterViewInit():void{
    revealPage(this.host);
    floatBooks(this.host);
  }
}