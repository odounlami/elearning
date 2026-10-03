import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course } from '../../models/course';

const VISUAL_VARIANTS = [
  'bg-ink text-cream',
  'bg-orange text-white',
  'bg-amber text-ink',
  'bg-paper-deep text-ink',
] as const;

@Component({ selector: 'app-course-card', imports: [RouterLink], templateUrl: './course-card.html' })
export class CourseCard {
  readonly course = input.required<Course>();
  readonly inLibrary = input(false);
  readonly visualVariant = computed(() => VISUAL_VARIANTS[(this.course().id - 1) % VISUAL_VARIANTS.length]);
}
