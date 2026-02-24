import { Component } from '@angular/core';
import { CreateRace } from './components/create-race/create-race';
import { MenuLateral } from '../../shared/menu-lateral/menu-lateral';
import { Header } from '../../shared/header/header';
import { CommonModule } from '@angular/common';
import { Toolbar } from '../../shared/toolbar/toolbar';
import { ListRacesComponent } from "./components/list-races-component/list-races-component";

@Component({
  selector: 'app-races',
  imports: [CreateRace, MenuLateral, Header, CommonModule, Toolbar, ListRacesComponent],
  templateUrl: './races.html',
  styleUrl: './races.scss',
})
export class Races {

}
