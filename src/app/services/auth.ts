import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { loguinResponse } from '../models/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
 private api = 'http://localhost:4000';

  constructor(private http: HttpClient) { }


  login(data: { email: string; password: string }) {
    return this.http.post<loguinResponse>(`${this.api}/api/auth/login`, data)
  }
}
