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

  get visualVariant(): string {
    const variants = [
      'bg-ink text-cream',
      'bg-orange text-white',
      'bg-paper-deep text-ink',
      'bg-green text-cream',
    ];
    return variants[(this.course().id - 1) % variants.length];
  }
}
