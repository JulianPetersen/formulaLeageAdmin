import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../../../services/blog-service';
import { BlogModel } from '../../../../models/blog';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardTitle } from '@angular/material/card';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MenuLateral } from '../../../../shared/menu-lateral/menu-lateral';
import { Toolbar } from '../../../../shared/toolbar/toolbar';
import { Header } from '../../../../shared/header/header';
import { BehaviorSubject, map, Observable, Subscription, switchMap } from 'rxjs';
import { MatChip } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { Router } from '@angular/router';
import { GlobalService } from '../../../../services/global-service';

@Component({
  selector: 'app-list-news',
  imports: [CommonModule, MatTableModule,
    MatIconModule, MatChip,
    MatButtonModule,
    MenuLateral, Toolbar, Header, MatPaginatorModule, MatFormField, MatLabel, MatInputModule],
  templateUrl: './list-news.html',
  styleUrl: './list-news.scss',
})
export class ListNews {
  displayedColumns: string[] = [
    'title',
    'status',
    'createdAt',
    'actions'
  ];

  pageSize = 20;
  currentPage = 0;
  filterValue = '';

  private refresh$ = new BehaviorSubject<void>(undefined);
  private subscription!: Subscription;

  blogs$: Observable<BlogModel[]> = this.refresh$.pipe(
    switchMap(() => this.blogService.getAllBlogs())
  );

  pagedBlogs$: Observable<BlogModel[]> = this.blogs$.pipe(
    map(blogs => {

      let filtered = blogs;

      if (this.filterValue) {
        const value = this.filterValue.toLowerCase();

        filtered = blogs.filter(blog =>
          blog.title?.toLowerCase().includes(value)
        );
      }

      const start = this.currentPage * this.pageSize;
      const end = start + this.pageSize;

      return filtered.slice(start, end);
    })
  );

  constructor(private blogService: BlogService, private router: Router, private global: GlobalService) { }

  ngOnInit() {

    this.subscription = this.blogService.blogAdded$.subscribe(() => {
      this.refresh$.next();
    });

  }


  togglePublish(blog: BlogModel) {

    const updatedBlog: BlogModel = {
      ...blog,
      published: !blog.published
    };

    this.blogService
      .updateBlog(updatedBlog, blog._id)
      .subscribe(() => {
        this.refresh$.next();
      });

  }


  publish(blog: BlogModel) {

    this.blogService.updateBlog({
      ...blog,
      published: true
    }, blog._id!).subscribe(() => {



    });

  }


  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.refresh$.next();
  }


  unpublish(blog: BlogModel) {

    this.blogService.updateBlog({
      ...blog,
      published: false
    }, blog._id!).subscribe(() => {



    });

  }

  delete(blog: BlogModel) {

    this.global.showAlertWhitFunction('ATENCION', '¿Estas seguro de eliminar esta noticia?', () => {
      this.blogService.deleteBlog(blog._id!).subscribe(() => {

        this.refresh$.next();

      });

    })

  }

  applyFilter(event: any) {

    const value = (event.target as HTMLInputElement).value;

    this.filterValue = value;
    this.currentPage = 0;

    this.refresh$.next();

  }


  edit(blog: BlogModel) {
    this.router.navigate(['/edit-news', blog._id]);
  }
}
