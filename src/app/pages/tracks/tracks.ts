import { Component } from '@angular/core';
import { Header } from '../../shared/header/header';
import { MenuLateral } from '../../shared/menu-lateral/menu-lateral';
import { Toolbar } from '../../shared/toolbar/toolbar';
import { CommonModule } from '@angular/common';
import { CreateTrack } from './components/create-track/create-track';
import { ListTrack } from './components/list-track/list-track';

@Component({
  selector: 'app-tracks',
  imports: [Header,Toolbar,MenuLateral,CommonModule,CreateTrack,ListTrack],
  templateUrl: './tracks.html',
  styleUrl: './tracks.scss',
})
export class Tracks {

}
