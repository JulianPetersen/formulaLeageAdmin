import { Component } from '@angular/core';
import { GlobalService } from '../../../../services/global-service';
import { PilotsServices } from '../../../../services/pilots-services';
import { PilotsModel } from '../../../../models/pilots';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { BehaviorSubject, Observable, Subscription, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UpdatePilotComponent } from '../update-pilot-component/update-pilot-component';

@Component({
  selector: 'app-list-pilots',
  standalone: true,
  imports: [
    MatIcon,
    MatCard,
    MatDivider,
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './list-pilots.html',
  styleUrl: './list-pilots.scss',
})
export class ListPilots {

  private refresh$ = new BehaviorSubject<void>(undefined);
  private subscription: Subscription
  allPilots$: Observable<PilotsModel[]> = this.refresh$.pipe(
    switchMap(() => this.pilotService.getAllPilots())
  );

  constructor(
    private global: GlobalService,
    private pilotService: PilotsServices,
    public dialog: MatDialog
  ) {

  }
  

  ngOnInit(){
        
    this.subscription  = this.pilotService.pilotsAdded$.subscribe(() => {
     this.refresh$.next()
    });
  }


  deletePilot(id: string) {
    this.global.showAlertWhitFunction(
      'ATENCION',
      'estas seguro de eliminar este equipo?',
      () => {
        this.pilotService.deletePilot(id).subscribe({
          next: () => {
            this.refresh$.next(); // 🔥 refresca la lista
          },
          error: err => console.log(err)
        });
      }
    );
  }



  editPilot(pilot: PilotsModel) {
    const dialog = this.dialog.open(UpdatePilotComponent, {
      width: '500px',
      data: pilot
    });
  
    dialog.afterClosed().subscribe((res:any) => {
      console.log('la res es',res)
      if (res === 'updated') {
         this.refresh$.next();
      }
    });
  }

}


