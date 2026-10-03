import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CoursesService } from '../../core/courses/courses.service';
import { Course, Module } from '../../shared/models/course';
import { ProgressBar } from '../../shared/components/progress-bar/progress-bar';
import { revealPage } from '../../shared/utils/page-motion';

@Component({
  imports: [RouterLink, ProgressBar],
  templateUrl: './player.html',
})
export class Player implements AfterViewInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(CoursesService);
  private readonly host = inject(ElementRef<HTMLElement>);

  @ViewChild('video') private video?: ElementRef<HTMLVideoElement>;

  readonly course = signal<Course | null>(null);
  readonly current = signal<Module | null>(null);
  readonly completed = signal<Set<number>>(new Set());


  constructor() {
    this.route.paramMap.subscribe((params) => {
      const courseId = Number(params.get('courseId'));
      const moduleId = Number(params.get('moduleId'));
      if (!Number.isInteger(courseId)) return;

      this.service.library().subscribe({
        next: (items) => {
          const enrollment = items.find((item) => item.course.id === courseId);
          this.completed.set(new Set(enrollment?.completedModuleIds ?? []));
          this.loadCourse(courseId, moduleId);
        },
      });
    });
  }

  private loadCourse(courseId: number, moduleId: number): void {
    this.service.get(courseId).subscribe({
      next: (course) => {
        this.course.set(course);
        const requested = course.modules.find((item) => item.id === moduleId);
        const module = requested ?? course.modules[0];
        if (!module) return;

        const moduleIndex = course.modules.findIndex((item) => item.id === module.id);
        const previous = moduleIndex > 0 ? course.modules[moduleIndex - 1] : null;

        if (previous && !this.completed().has(previous.id)) {
          void this.router.navigate(['/learn', course.id, previous.id], { replaceUrl: true });
          return;
        }

        this.current.set(module);

        if (module.id !== moduleId) {
          void this.router.navigate(['/learn', course.id, module.id], { replaceUrl: true });
        }
      },
    });
  }

  ngAfterViewInit(): void {
    revealPage(this.host);
  }

  get progress(): number {
    const course = this.course();
    return course?.modules.length
      ? Math.round((this.completed().size / course.modules.length) * 100)
      : 0;
  }

}