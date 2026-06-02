import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { loguinResponse } from '../models/auth';
import { GlobalService } from './global-service';
import { Router } from '@angular/router';

const TOKEN_KEY = 'token';
const user = 'user'


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient,private global:GlobalService, private router:Router) { }


  login(data: { email: string; password: string }) {
    return this.http.post<loguinResponse>(`${this.global.api}/api/auth/login`, data)
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(user);
    sessionStorage.clear();
    window.location.reload();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
  
}
