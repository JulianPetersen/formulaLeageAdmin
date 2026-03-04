import { Component } from '@angular/core';
import { MenuLateral } from '../../shared/menu-lateral/menu-lateral';
import { Header } from '../../shared/header/header';
import { Toolbar } from '../../shared/toolbar/toolbar';
import { CommonModule } from '@angular/common';
import { FormCreatePrize } from './components/form-create-prize/form-create-prize';
import { ListPrizes } from "./components/list-prizes/list-prizes";

@Component({
  selector: 'app-prizes-page',
  imports: [MenuLateral, Header, Toolbar, CommonModule, FormCreatePrize, ListPrizes,],
  templateUrl: './prizes-page.html',
  styleUrl: './prizes-page.scss',
})
export class PrizesPage {

}
