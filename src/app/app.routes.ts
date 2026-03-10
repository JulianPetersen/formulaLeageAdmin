import { Routes } from '@angular/router';

import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: 'admin', canActivate: [authGuard], loadComponent: () => import('./pages/admin/admin').then(c => c.Admin) },
    { path: 'teams', canActivate: [authGuard], loadComponent: () => import('./pages/teams/teams').then(c => c.Teams) },
    { path: 'pilots', canActivate: [authGuard], loadComponent: () => import('./pages/pilots/pilots').then(c => c.Pilots) },
    { path: 'tracks', canActivate: [authGuard], loadComponent: () => import('./pages/tracks/tracks').then(c => c.Tracks) },
    { path: 'races', canActivate: [authGuard], loadComponent: () => import('./pages/races/races').then(c => c.Races) },
    { path: 'blog', canActivate: [authGuard], loadComponent: () => import('./pages/blog-page/blog-page').then(c => c.BlogPage) },
    { path: 'prizes', canActivate: [authGuard], loadComponent: () => import('./pages/prizes-page/prizes-page').then(c => c.PrizesPage) },
    { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
];
