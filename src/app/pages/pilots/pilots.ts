import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MenuLateral } from '../../shared/menu-lateral/menu-lateral';
import { Header } from '../../shared/header/header';
import { CommonModule } from '@angular/common';
import { Toolbar } from '../../shared/toolbar/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { FormCreatePilotComponent } from './component/form-create-pilot-component/form-create-pilot-component';
import { ListPilots } from './component/list-pilots/list-pilots';

@Component({
  selector: 'app-pilots',
  imports: [MenuLateral, Header, CommonModule, Toolbar, ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    FormCreatePilotComponent,
    ListPilots
    
    ],
  templateUrl: './pilots.html',
  styleUrl: './pilots.scss',
})
export class Pilots {

}
