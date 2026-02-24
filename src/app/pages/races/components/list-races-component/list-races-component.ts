import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatChip } from '@angular/material/chips';
import { MatDivider } from '@angular/material/divider';
import { RacesService } from '../../../../services/races-service';
import { BehaviorSubject, Observable, Subscription, switchMap } from 'rxjs';
import { RaceModel } from '../../../../models/race';
import { MatDialog } from '@angular/material/dialog';
import { CloseRace } from '../close-race/close-race';

@Component({
  selector: 'app-list-races-component',
  imports: [
    CommonModule,
    MatCard,
    MatButtonModule,
    MatChip
  ],
  templateUrl: './list-races-component.html',
  styleUrl: './list-races-component.scss',
})
export class ListRacesComponent {

  private refresh$ = new BehaviorSubject<void>(undefined);
  private subscription: Subscription
  races$: Observable<RaceModel[]> = this.refresh$.pipe(
    switchMap(() => this.racesService.getAllRaces())
  );

  constructor(
    private racesService: RacesService,
    public dialog: MatDialog

  ) {}

    ngOnInit(){
        
    this.subscription  = this.racesService.racesAdded$.subscribe(() => {
     this.refresh$.next()
    });
  }


  changeStatusToLista(id:string){
    this.racesService.updateRaceStatus(id,"lista")
      .subscribe(() => {
     this.refresh$.next()
    })
  }

closeRace(race: RaceModel) {
  const dialog = this.dialog.open(CloseRace, {
    width: '600px',
    data: race
  });

  dialog.afterClosed().subscribe(res => {
    if (res === 'closed') {
      this.refresh$.next();
    }
  });
}

  refresh() {
    this.refresh$.next();
  }
}

