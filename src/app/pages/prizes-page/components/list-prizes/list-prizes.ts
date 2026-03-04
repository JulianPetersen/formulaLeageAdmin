import { Component } from '@angular/core';
import { PrizesService } from '../../../../services/prizes-service';
import { PrizeModel } from '../../../../models/prize-model';
import { MatCard } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, Subscription, switchMap } from 'rxjs';
import { MatChip } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { GlobalService } from '../../../../services/global-service';
import { MatDialog } from '@angular/material/dialog';
import { UpdatePrize } from '../update-prize/update-prize';

@Component({
  selector: 'app-list-prizes',
  imports: [MatCard, CommonModule, MatChip,
    MatCard,
    MatButtonModule,
    MatChip,
    MatIcon],
  templateUrl: './list-prizes.html',
  styleUrl: './list-prizes.scss',
})
export class ListPrizes {


  private refresh$ = new BehaviorSubject<void>(undefined);
  private subscription: Subscription
  prizes$: Observable<PrizeModel[]> = this.refresh$.pipe(
    switchMap(() => this.prizeServices.getAllPrizes())
  );

  constructor(private prizeServices: PrizesService, private global: GlobalService,public dialog: MatDialog) {

  }



  changeStatusToActive(id: string) {
    this.prizeServices.changeStatusToActive(id, 'activo')
      .subscribe(() => {
        this.refresh$.next()
      })
  }


  changeStatusToCLose(id: string) {

    this.global.showAlertWhitFunction('Atencion', 'Está seguro que quiere cerrar este premio?', () => {
      let data: PrizeModel = {
        status: 'cerrado',
      }
      this.prizeServices.updatePrizeData(id, data)
        .subscribe(() => {
          this.refresh$.next()
        })

    })



  }

  editPrize(prize: PrizeModel) {

    const dialog = this.dialog.open(UpdatePrize, {
        width: '500px',
        data: prize
      });
    
      dialog.afterClosed().subscribe((res:any) => {
        console.log('la res es',res)
        if (res === 'updated') {
          console.log('actualizado')
        }
      });
  }
}





