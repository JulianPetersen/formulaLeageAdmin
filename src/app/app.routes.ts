import { Routes } from '@angular/router';

import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: 'admin', canActivate: [authGuard], loadComponent: () => import('./pages/admin/admin').then(c => c.Admin) },
    { path: 'teams', canActivate: [authGuard], loadComponent: () => import('./pages/teams/teams').then(c => c.Teams) },
    { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
];
