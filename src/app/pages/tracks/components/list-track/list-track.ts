import { ChangeDetectorRef, Component } from '@angular/core';
import { TracksModel } from '../../../../models/tracks';
import { BehaviorSubject, Observable, Subscription, switchMap } from 'rxjs';
import { TeamsService } from '../../../../services/teams';
import { GlobalService } from '../../../../services/global-service';
import { MatDialog } from '@angular/material/dialog';
import { TrackService } from '../../../../services/track-service';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { UpdateTrack } from '../update-track/update-track';

@Component({
  selector: 'app-list-track',
    imports: [
    MatIcon,
    MatCard,
    MatDivider,
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './list-track.html',
  styleUrl: './list-track.scss',
})
export class ListTrack {

  private refresh$ = new BehaviorSubject<void>(undefined);
  private subscription: Subscription
  
  allTracks$: Observable<TracksModel[]> = this.refresh$.pipe(
    switchMap(() => this.TrackService.getAllTracks())
  );


    constructor(private TrackService:TrackService,
              public global:GlobalService,
              public dialog: MatDialog){

  }


    ngOnInit(){
        
    this.subscription  = this.TrackService.tracksAdded$.subscribe(() => {
     this.refresh$.next()
    });
  }


    deleteTrack(id: string) {
      this.global.showAlertWhitFunction(
        'ATENCION',
        'estas seguro de eliminar este circuito?',
        () => {
          this.TrackService.deleteTrack(id).subscribe({
            next: () => {
              this.refresh$.next(); // 🔥 refresca la lista
            },
            error: err => console.log(err)
          });
        }
      );
    }
  
  
  
    editTrack(track: TracksModel) {
      const dialog = this.dialog.open(UpdateTrack, {
        width: '500px',
        data: track
      });
    
      dialog.afterClosed().subscribe((res:any) => {
        console.log('la res es',res)
        if (res === 'updated') {
           this.refresh$.next();
        }
      });
    }
}
