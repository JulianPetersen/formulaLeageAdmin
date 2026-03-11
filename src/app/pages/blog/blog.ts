import { Component } from '@angular/core';
import { MenuLateral } from '../../shared/menu-lateral/menu-lateral';
import { Header } from '../../shared/header/header';
import { Toolbar } from '../../shared/toolbar/toolbar';
import { CommonModule } from '@angular/common';
import { createBlog } from "./components/create-news/create-news";

@Component({
  selector: 'app-blog',
  imports: [MenuLateral,
    Header,
    Toolbar,
    CommonModule, createBlog],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog {

}
