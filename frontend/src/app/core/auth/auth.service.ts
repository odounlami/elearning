import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../config';
import { User } from '../../shared/models/user';
interface AuthResponse { accessToken: string; user: User; }
@Injectable({ providedIn: 'root' })
export class AuthService {
 private readonly http=inject(HttpClient); private readonly router=inject(Router); private readonly userState=signal<User|null>(null); readonly user=this.userState.asReadonly();
 constructor(){const raw=localStorage.getItem('elearning_user');if(raw){try{this.userState.set(JSON.parse(raw));}catch{localStorage.removeItem('elearning_user');}}}
 login(email:string,password:string):Observable<AuthResponse>{return this.http.post<AuthResponse>(API_BASE_URL+'/auth/login',{email,password}).pipe(tap(r=>this.save(r)));}
 register(name:string,email:string,password:string):Observable<AuthResponse>{return this.http.post<AuthResponse>(API_BASE_URL+'/auth/register',{name,email,password}).pipe(tap(r=>this.save(r)));}
 logout(){localStorage.removeItem('elearning_token');localStorage.removeItem('elearning_user');this.userState.set(null);void this.router.navigateByUrl('/');}
 isAuthenticated(){return !!localStorage.getItem('elearning_token');} token(){return localStorage.getItem('elearning_token');}
 private save(r:AuthResponse){localStorage.setItem('elearning_token',r.accessToken);localStorage.setItem('elearning_user',JSON.stringify(r.user));this.userState.set(r.user);}
}