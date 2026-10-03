import { AfterViewInit, Component, ElementRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CoursesService } from '../../core/courses/courses.service';
import { Course, Module } from '../../shared/models/course';
import { ProgressBar } from '../../shared/components/progress-bar/progress-bar';
import { revealPage } from '../../shared/utils/page-motion';

@Component({imports:[FormsModule,RouterLink,ProgressBar],templateUrl:'./player.html'})
export class Player implements AfterViewInit {
  private readonly route=inject(ActivatedRoute);private readonly service=inject(CoursesService);private readonly host=inject(ElementRef<HTMLElement>);
  readonly course=signal<Course|null>(null);readonly current=signal<Module|null>(null);completed=new Set<number>();audioLanguage='';
  constructor(){const cid=Number(this.route.snapshot.paramMap.get('courseId'));const mid=Number(this.route.snapshot.paramMap.get('moduleId'));this.service.get(cid).subscribe(c=>{this.course.set(c);const m=c.modules.find(x=>x.id===mid)||c.modules[0];this.current.set(m);this.audioLanguage=m?.audioTracks[0]?.language||c.language;});this.service.library().subscribe(xs=>xs.find(x=>x.course.id===cid)?.completedModuleIds.forEach(id=>this.completed.add(id)));}
  ngAfterViewInit(){revealPage(this.host);}
  get progress(){const c=this.course();return c?Math.round(this.completed.size/c.modules.length*100):0;}
  complete(){const m=this.current();if(!m)return;this.service.completeModule(m.id).subscribe(()=>{this.completed.add(m.id);this.completed=new Set(this.completed);});}
  selectModule(m:Module){this.current.set(m);this.audioLanguage=m.audioTracks[0]?.language||this.course()?.language||'';}
}