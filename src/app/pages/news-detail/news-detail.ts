import { ChangeDetectorRef, Component } from '@angular/core';
import { GlobalService } from '../../services/global-service';
import { NewsService } from '../../services/news-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-news-detail',
  imports: [],
  templateUrl: './news-detail.html',
  styleUrl: './news-detail.scss',
})
export class NewsDetail {
slug = '';
news:any;
  constructor(private global:GlobalService, private newsService:NewsService,private route: ActivatedRoute,private cdr: ChangeDetectorRef){

  }



  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.slug = params.get('slug') || '';

      
        this.getNewBySlug();
        
      });

  }



  getNewBySlug() {
    this.newsService.getNewsBySlug(this.slug)
      .subscribe({
        next: (res) => {
          console.log('la noticia es', res);
          this.news = res
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

}
