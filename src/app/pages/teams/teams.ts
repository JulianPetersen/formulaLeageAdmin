import { Component } from '@angular/core';
import { Header } from '../../shared/header/header';
import { MenuLateral } from '../../shared/menu-lateral/menu-lateral';
import { CommonModule } from '@angular/common';
import { Toolbar } from '../../shared/toolbar/toolbar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TeamsService } from '../../services/teams';
import { FormCreateTeam } from './components/form-create-team/form-create-team';
import { ListTeams } from './components/list-teams/list-teams';

@Component({
  selector: 'app-teams',
  imports: [MenuLateral, Header, CommonModule, Toolbar, ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    FormCreateTeam,
    ListTeams],
  templateUrl: './teams.html',
  styleUrl: './teams.scss',
})
export class Teams {




  constructor(public teamService:TeamsService,private fb: FormBuilder,){

}




}

