import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global-service';

@Injectable({
  providedIn: 'root',
})
export class NewsService {


  constructor(private http: HttpClient, private global: GlobalService) {

  }





  getNewsBySlug(slug: string) {
    return this.http.get(
      `${this.global.api}/api/blog/slug/${slug}`,
    );
  }
}
