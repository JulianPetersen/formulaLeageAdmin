import { Routes } from '@angular/router';

import { authGuard } from './guards/auth-guard';
import { Verify } from './pages/verify/verify';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./pages/home/home').then(c => c.Home) },
    { path: 'home', loadComponent: () => import('./pages/home/home').then(c => c.Home) },
    { path: 'admin', canActivate: [authGuard], loadComponent: () => import('./pages/admin/admin').then(c => c.Admin) },
    { path: 'teams', canActivate: [authGuard], loadComponent: () => import('./pages/teams/teams').then(c => c.Teams) },
    { path: 'pilots', canActivate: [authGuard], loadComponent: () => import('./pages/pilots/pilots').then(c => c.Pilots) },
    { path: 'tracks', canActivate: [authGuard], loadComponent: () => import('./pages/tracks/tracks').then(c => c.Tracks) },
    { path: 'races', canActivate: [authGuard], loadComponent: () => import('./pages/races/races').then(c => c.Races) },
    { path: 'blog', canActivate: [authGuard], loadComponent: () => import('./pages/blog/blog').then(c => c.Blog) },
    { path: 'prizes', canActivate: [authGuard], loadComponent: () => import('./pages/prizes-page/prizes-page').then(c => c.PrizesPage) },
    { path: 'users-admin', canActivate: [authGuard], loadComponent: () => import('./pages/admin-users/admin-users').then(c => c.AdminUSers) },
    { path: 'list-news', canActivate: [authGuard], loadComponent: () => import('./pages/blog/components/list-news/list-news').then(c => c.ListNews) },
    { path: 'edit-news/:id', canActivate: [authGuard], loadComponent: () => import('./pages/blog/components/edit-news/edit-news').then(c => c.EditNews) },
    { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
    {
        path: 'verify',
        component: Verify
    },
     { path: 'termsandcondtions', loadComponent: () => import('./pages/terms-conditions/terms-conditions').then(m => m.TermsConditions) },
     { path: 'reset-password', loadComponent: () => import('./pages/reser-password/reser-password').then(m => m.ReserPassword) },
];
