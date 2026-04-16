import { Component } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTab, MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-terms-conditions',
  imports: [MatIcon,MatCard,MatTab,MatTabGroup],
  templateUrl: './terms-conditions.html',
  styleUrl: './terms-conditions.scss',
})
export class TermsConditions {
  selectedTab = 0;

  goBack() {
    window.history.back();
  }
}
