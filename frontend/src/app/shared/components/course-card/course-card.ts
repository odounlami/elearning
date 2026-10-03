import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course } from '../../models/course';
@Component({selector:'app-course-card',imports:[RouterLink],templateUrl:'./course-card.html'}) export class CourseCard { readonly course=input.required<Course>(); }