import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', title: 'Accueil', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'courses', title: 'Formations', loadComponent: () => import('./pages/courses/courses').then(m => m.Courses) },
  { path: 'courses/:id', title: 'Formation', loadComponent: () => import('./pages/course-detail/course-detail').then(m => m.CourseDetail) },
  { path: 'login', title: 'Connexion', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { path: 'register', title: 'Inscription', loadComponent: () => import('./pages/register/register').then(m => m.Register) },
  { path: 'forgot-password', title: 'Mot de passe oublié', loadComponent: () => import('./pages/forgot-password/forgot-password').then(m => m.ForgotPassword) },
  { path: 'dashboard', title: 'Ma bibliothèque', canActivate: [authGuard], loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard) },
  { path: 'learn/:courseId/:moduleId', title: 'Apprentissage', canActivate: [authGuard], loadComponent: () => import('./pages/player/player').then(m => m.Player) },
  { path: '**', redirectTo: '' },
];