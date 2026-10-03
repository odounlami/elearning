import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course } from '../../models/course';

@Component({
  selector: 'app-course-card',
  imports: [RouterLink],
  templateUrl: './course-card.html',
})
export class CourseCard {
  readonly course = input.required<Course>();
  readonly inLibrary = input(false);

  get coverVariant(): string {
    const variants = [
      'h-48 w-28 -rotate-6 bg-ink',
      'h-52 w-32 rotate-3 bg-orange',
      'h-44 w-26 -rotate-3 bg-cream border border-line',
      'h-56 w-34 rotate-6 bg-paper-deep',
    ];
    return variants[this.course().id % variants.length];
  }
}
