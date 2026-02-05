import { ChangeDetectorRef, Component } from '@angular/core';
import { TeamsService } from '../../../../services/teams';
import { MatCardModule } from '@angular/material/card';
import { MatDivider, } from '@angular/material/list';
import { TeamsModel } from '../../../../models/teams';
import { MatIcon } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { GlobalService } from '../../../../services/global-service';

import { UpdateTeam } from '../update-team/update-team';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-list-teams',
  imports: [MatCardModule,MatIcon,MatButtonModule,MatDivider,CommonModule],
  templateUrl: './list-teams.html',
  styleUrl: './list-teams.scss',
})
export class ListTeams {

  AllTeams:TeamsModel[] = [] 
  private subscription: Subscription

  constructor(private teamService:TeamsService,
              private cdr: ChangeDetectorRef, 
              public global:GlobalService,
              public dialog: MatDialog){

  }

  ngOnInit(){
    this.getAllTeams()

    this.subscription  = this.teamService.teamsAdded$.subscribe(() => {
      this.getAllTeams()
    });
    
  }


  getAllTeams(){
    this.teamService.getAllTeams()
      .subscribe({
        next: ((res:TeamsModel[]) =>{
          console.log('LOS EQUIPOS SON',res);
          this.AllTeams = res;
          this.cdr.detectChanges()
        }),
        error :((err) => {console.log(err)})
      })
  }

  deleteTeam(id:string){

    this.global.showAlertWhitFunction('ATENCION','estas seguro de eliminar este equipo?', () => { 
          this.teamService.deleteTeam(id)
      .subscribe({
        next: ((res) => {
          console.log(res)
          this.getAllTeams()  
        }),
        error:((err) => {
          console.log(err)
        })
      })
    })

  }


editTeam(team: TeamsModel) {
  const dialog = this.dialog.open(UpdateTeam, {
    width: '500px',
    data: team
  });

  dialog.afterClosed().subscribe((res:any) => {
    console.log('la res es',res)
    if (res === 'updated') {
      this.getAllTeams();
    }
  });
}
}
