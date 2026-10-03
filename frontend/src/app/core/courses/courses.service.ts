import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config';
import { Course, Enrollment } from '../../shared/models/course';

@Injectable({ providedIn: 'root' })
export class CoursesService {
  private readonly http = inject(HttpClient);

  list() { return this.http.get<Course[]>(API_BASE_URL + '/courses'); }
  get(id: number) { return this.http.get<Course>(API_BASE_URL + '/courses/' + id); }
  library() { return this.http.get<Enrollment[]>(API_BASE_URL + '/me/courses'); }
  enroll(id: number) { return this.http.post(API_BASE_URL + '/courses/' + id + '/enroll', {}); }
  completeModule(id: number) { return this.http.post(API_BASE_URL + '/modules/' + id + '/complete', {}); }
  favorite(id: number) { return this.http.post<{ favorite: true }>(API_BASE_URL + '/courses/' + id + '/favorite', {}); }
  unfavorite(id: number) { return this.http.delete<{ favorite: false }>(API_BASE_URL + '/courses/' + id + '/favorite'); }
}
