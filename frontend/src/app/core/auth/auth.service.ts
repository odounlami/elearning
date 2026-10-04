import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { API_BASE_URL } from '../config';
import { User } from '../../shared/models/user';
import { getAuthErrorMessage } from './auth-error';
import { CoursesService } from '../courses/courses.service';

interface AuthResponse { accessToken: string; user: User; }

export type AuthResult =
  | { success: true; data: AuthResponse }
  | { success: false; message: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http=inject(HttpClient); private readonly router=inject(Router); private readonly courses=inject(CoursesService); private readonly userState=signal<User|null>(null); readonly user=this.userState.asReadonly();
  constructor(){const raw=localStorage.getItem('elearning_user');if(raw){try{this.userState.set(JSON.parse(raw));}catch{localStorage.removeItem('elearning_user');}}}
  login(email:string,password:string):Observable<AuthResult>{
    return this.http.post<AuthResponse>(API_BASE_URL+'/auth/login',{email,password}).pipe(
      tap(r=>this.save(r)),
      map(data=>({success:true as const,data})),
      catchError(error=>of({success:false as const,message:getAuthErrorMessage(error,'login')})),
    );
  }
  register(name:string,email:string,password:string):Observable<AuthResult>{
    return this.http.post<AuthResponse>(API_BASE_URL+'/auth/register',{name,email,password}).pipe(
      tap(r=>this.save(r)),
      map(data=>({success:true as const,data})),
      catchError(error=>of({success:false as const,message:getAuthErrorMessage(error,'register')})),
    );
  }
  logout(){localStorage.removeItem('elearning_token');localStorage.removeItem('elearning_user');this.userState.set(null);this.courses.clearUserData();void this.router.navigateByUrl('/');}
  isAuthenticated(){return !!localStorage.getItem('elearning_token');} token(){return localStorage.getItem('elearning_token');}
  private save(r:AuthResponse){localStorage.setItem('elearning_token',r.accessToken);localStorage.setItem('elearning_user',JSON.stringify(r.user));this.userState.set(r.user);this.courses.preloadUserData();}
}
