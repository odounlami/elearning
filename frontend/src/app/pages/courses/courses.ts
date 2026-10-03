import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CourseCard } from '../../shared/components/course-card/course-card';
import { Course, Level } from '../../shared/models/course';
import { CoursesService } from '../../core/courses/courses.service';
@Component({imports:[FormsModule,CourseCard],templateUrl:'./courses.html'}) export class Courses { private readonly service=inject(CoursesService); readonly all=signal<Course[]>([]); search=''; level:'ALL'|Level='ALL'; constructor(){this.service.list().subscribe(c=>this.all.set(c));} get filtered(){const t=this.search.trim().toLowerCase();return this.all().filter(c=>(!t||`${c.title} ${c.description} ${c.instructor}`.toLowerCase().includes(t))&&(this.level==='ALL'||c.level===this.level));} }