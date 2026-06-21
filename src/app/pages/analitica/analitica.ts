import { Component } from '@angular/core';
import { MenuLateral } from '../../shared/menu-lateral/menu-lateral';
import { Header } from '../../shared/header/header';
import { CommonModule } from '@angular/common';
import { Toolbar } from '../../shared/toolbar/toolbar';
import { GlobalService } from '../../services/global-service';
import { ChangeDetectorRef } from '@angular/core';
import { VisitsPageModel } from '../../models/visits-page';

@Component({
  selector: 'app-analitica',
  imports: [MenuLateral, Header, CommonModule, Toolbar],
  templateUrl: './analitica.html',
  styleUrl: './analitica.scss',
})
export class Analitica {

  constructor(private global: GlobalService, private cd: ChangeDetectorRef) { }


  visitHome: number;
  clickDownload: number;

  ngOnInit() {
    this.getVisits()
    this.countDownloadClick()
  }


  getVisits() {
    this.global.getVisitsPage('HOME')
      .subscribe({
        next: ((res: VisitsPageModel) => {
          console.log(res);

          this.visitHome = res.count
          this.cd.detectChanges();
        }),
        error: ((err) => {
          console.log(err)
        })
      })
  }

  countDownloadClick() {
    this.global.getVisitsPage('DESCARGA')
      .subscribe({
        next: ((res: VisitsPageModel) => {
          console.log(res);

          this.clickDownload = res.count
          this.cd.detectChanges();
        }),
        error: ((err) => {
          console.log(err)
        })
      })
  }
}
