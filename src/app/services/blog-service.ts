import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { BlogModel } from '../models/blog';
import { GlobalService } from './global-service';

@Injectable({
  providedIn: 'root',
})
export class BlogService {

  constructor(private http: HttpClient, private global:GlobalService) {}

  private blogAddedSource = new Subject<void>();
  blogAdded$ = this.blogAddedSource.asObservable();

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getHeaders() {
    const token = this.getToken();

    return new HttpHeaders({
      authorization: `Bearer ${token}` || '',
    });
  }

  createBlog(data: BlogModel) {
    const headers = this.getHeaders();

    return this.http.post(`${this.global.api}/api/blog`, data, { headers });
  }

  getAllBlogs() {
    const headers = this.getHeaders();

    return this.http.get<BlogModel[]>(`${this.global.api}/api/blog`, { headers });
  }

  getBlogById(id: string) {
    const headers = this.getHeaders();

    return this.http.get<BlogModel>(`${this.global.api}/api/blog/${id}`, { headers });
  }

  deleteBlog(id: string) {
    const headers = this.getHeaders();

    return this.http.delete(`${this.global.api}/api/blog/${id}`, { headers });
  }

  updateBlog(data: BlogModel, id: string) {
    const headers = this.getHeaders();

    return this.http.patch(`${this.global.api}/api/blog/${id}`, data, { headers });
  }

  uploadImage(file: File) {

    const headers = this.getHeaders();

    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.global.api}/api/blog/upload`, formData, { headers });
  }

  notifyBlogAdded() {
    this.blogAddedSource.next();
  }


getBlogBySlug(slug: string) {
  const headers = this.getHeaders();

  return this.http.get<BlogModel>(`${this.global.api}/api/blog/slug/${slug}`, { headers });
}
}