import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CoursesService } from '../../core/courses/courses.service';
import { Course, Module } from '../../shared/models/course';
import { ProgressBar } from '../../shared/components/progress-bar/progress-bar';
import { revealPage } from '../../shared/utils/page-motion';

declare const Hls: any;

@Component({
  imports: [FormsModule, RouterLink, ProgressBar],
  templateUrl: './player.html',
})
export class Player implements AfterViewInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(CoursesService);
  private readonly host = inject(ElementRef<HTMLElement>);

  private hls?: any;

  readonly course = signal<Course | null>(null);
  readonly current = signal<Module | null>(null);
  readonly completed = signal<Set<number>>(new Set());
  readonly audioTracks = signal<{ id: number; language: string; label: string }[]>([]);

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
        this.audioLanguage = '';
        this.audioTracks.set([]);

        if (module.id !== moduleId) {
          void this.router.navigate(['/learn', course.id, module.id], { replaceUrl: true });
        }

        setTimeout(() => this.setupPlayer(), 0);
      },
    });
  }

  ngAfterViewInit(): void {
    revealPage(this.host);
    setTimeout(() => this.setupPlayer(), 0);
  }

  ngOnDestroy(): void {
    this.hls?.destroy();
  }

  private setupPlayer(): void {
    const element = this.host.nativeElement.querySelector<HTMLVideoElement>('#learning-video');
    const source = this.current()?.videoUrl;
    if (!element || !source) return;

    this.hls?.destroy();

    if (typeof Hls !== 'undefined' && Hls.isSupported()) {
      const hls = new Hls();
      this.hls = hls;
      hls.loadSource(source);
      hls.attachMedia(element);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const tracks = hls.audioTracks.map((track: any, index: number) => ({
          id: index,
          language: track.lang === 'fra' ? 'Français' : track.lang === 'eng' ? 'English' : track.name,
          label: track.name,
        }));
        this.audioTracks.set(tracks);

        const first = tracks[0];
        if (first) {
          this.audioLanguage = first.language;
          hls.audioTrack = first.id;
        }
      });
      return;
    }

    if (element.canPlayType('application/vnd.apple.mpegurl')) {
      element.src = source;
    }
  }

  get progress(): number {
    const course = this.course();
    return course?.modules.length
      ? Math.round((this.completed().size / course.modules.length) * 100)
      : 0;
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
    const track = this.audioTracks().find((item) => item.language === this.audioLanguage);
    if (track && this.hls) this.hls.audioTrack = track.id;
  }
}
