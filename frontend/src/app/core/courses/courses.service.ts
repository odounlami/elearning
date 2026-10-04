import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config';
import { Course, Enrollment } from '../../shared/models/course';
import { Observable, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CoursesService {
  private readonly http = inject(HttpClient);
  private readonly libraryState = signal<Enrollment[] | null>(null);
  private readonly favoritesState = signal<Course[] | null>(null);

  list() { return this.http.get<Course[]>(API_BASE_URL + '/courses'); }
  get(id: number) { return this.http.get<Course>(API_BASE_URL + '/courses/' + id); }

  library(force = false): Observable<Enrollment[]> {
    const cached = this.libraryState();
    if (cached && !force) return of(cached);
    return this.http.get<Enrollment[]>(API_BASE_URL + '/me/courses').pipe(tap(items => this.libraryState.set(items)));
  }

  favorites(force = false): Observable<Course[]> {
    const cached = this.favoritesState();
    if (cached && !force) return of(cached);
    return this.http.get<Course[]>(API_BASE_URL + '/me/favorites').pipe(tap(items => this.favoritesState.set(items)));
  }

  preloadUserData(): void {
    this.library(true).subscribe();
    this.favorites(true).subscribe();
  }

  clearUserData(): void {
    this.libraryState.set(null);
    this.favoritesState.set(null);
  }

  enroll(id: number) {
    return this.http.post(API_BASE_URL + '/courses/' + id + '/enroll', {}).pipe(
      tap(() => this.libraryState.update(items => items ?? [])),
      tap(() => this.library(true).subscribe()),
    );
  }

  completeModule(id: number) {
    return this.http.post(API_BASE_URL + '/modules/' + id + '/complete', {}).pipe(
      tap(() => this.library(true).subscribe()),
    );
  }

  favorite(id: number) {
    return this.http.post<{ favorite: boolean }>(API_BASE_URL + '/courses/' + id + '/favorite', {}).pipe(
      tap(() => this.favorites(true).subscribe()),
    );
  }

  unfavorite(id: number) {
    return this.http.delete<{ favorite: boolean }>(API_BASE_URL + '/courses/' + id + '/favorite').pipe(
      tap(() => this.favorites(true).subscribe()),
    );
  }
}
