import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { loguinResponse } from '../models/auth';
import { GlobalService } from './global-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {


  constructor(private http: HttpClient,private global:GlobalService) { }


  login(data: { email: string; password: string }) {
    return this.http.post<loguinResponse>(`${this.global.api}/api/auth/login`, data)
  }
}
