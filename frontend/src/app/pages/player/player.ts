import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CoursesService } from '../../core/courses/courses.service';
import { Course, Module } from '../../shared/models/course';
import { ProgressBar } from '../../shared/components/progress-bar/progress-bar';
import { revealPage } from '../../shared/utils/page-motion';

@Component({
  imports: [FormsModule, RouterLink, ProgressBar],
  templateUrl: './player.html',
})
export class Player implements AfterViewInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(CoursesService);
  private readonly host = inject(ElementRef<HTMLElement>);

  @ViewChild('video') private video?: ElementRef<HTMLVideoElement>;
  @ViewChild('audio') private audio?: ElementRef<HTMLAudioElement>;

  readonly course = signal<Course | null>(null);
  readonly current = signal<Module | null>(null);
  readonly completed = signal<Set<number>>(new Set());

  audioLanguage = '';

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
        this.audioLanguage = module.audioTracks?.[0]?.language ?? course.language;

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

  get audioTracks() {
    return this.current()?.audioTracks ?? [];
  }

  get selectedTrack() {
    return this.audioTracks.find((track) => track.language === this.audioLanguage) ?? this.audioTracks[0];
  }

  get currentIndex(): number {
    const course = this.course();
    const current = this.current();
    return course && current ? course.modules.findIndex((module) => module.id === current.id) : -1;
  }

  get hasPrevious(): boolean {
    return this.currentIndex > 0;
  }

  get hasNext(): boolean {
    const course = this.course();
    return !!course && this.currentIndex >= 0 && this.currentIndex < course.modules.length - 1;
  }

  get canGoNext(): boolean {
    const module = this.current();
    return !!module && this.completed().has(module.id);
  }

  isUnlocked(module: Module): boolean {
    const course = this.course();
    if (!course) return false;
    const index = course.modules.findIndex((item) => item.id === module.id);
    return index <= 0 || this.completed().has(course.modules[index - 1].id);
  }

  complete(): void {
    const module = this.current();
    if (!module || this.completed().has(module.id)) return;

    this.service.completeModule(module.id).subscribe({
      next: () => {
        this.completed.update((items) => new Set(items).add(module.id));
      },
    });
  }

  selectModule(module: Module): void {
    if (!this.isUnlocked(module)) return;
    const course = this.course();
    if (!course) return;
    void this.router.navigate(['/learn', course.id, module.id]);
  }

  previous(): void {
    const course = this.course();
    if (course && this.hasPrevious) this.selectModule(course.modules[this.currentIndex - 1]);
  }

  next(): void {
    const course = this.course();
    if (course && this.hasNext && this.canGoNext) this.selectModule(course.modules[this.currentIndex + 1]);
  }

  onAudioLanguageChange(): void {
    const video = this.video?.nativeElement;
    const audio = this.audio?.nativeElement;
    if (!video || !audio) return;
    audio.currentTime = video.currentTime;
    if (!video.paused) void audio.play().catch(() => undefined);
  }

  syncPlay(): void {
    const audio = this.audio?.nativeElement;
    if (audio) {
      audio.currentTime = this.video?.nativeElement.currentTime ?? 0;
      void audio.play().catch(() => undefined);
    }
  }

  syncPause(): void {
    this.audio?.nativeElement.pause();
  }

  syncSeek(): void {
    const video = this.video?.nativeElement;
    const audio = this.audio?.nativeElement;
    if (video && audio) audio.currentTime = video.currentTime;
  }

  syncTime(): void {
    const video = this.video?.nativeElement;
    const audio = this.audio?.nativeElement;
    if (video && audio && Math.abs(video.currentTime - audio.currentTime) > 0.35) {
      audio.currentTime = video.currentTime;
    }
  }
}
