import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global-service';
import { PaginatedUsers } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient, private global: GlobalService) { }



  getToken(): string | null {
    return localStorage.getItem('token');
  }


getUsers(page: number = 1, limit: number = 10, search: string = '') {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
  let params = new HttpParams()
    .set('page', page)
    .set('limit', limit);

  if (search) {
    params = params.set('search', search);
  }

  return this.http.get<PaginatedUsers>(`${this.global.api}/api/user/getAllUSers`, { params , headers},);
}


 
}
