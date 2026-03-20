import { Component, EventEmitter, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabLabel } from '@angular/material/tabs';

@Component({
  selector: 'app-search-user',
  imports: [MatFormFieldModule,MatInputModule],
  templateUrl: './search-user.html',
  styleUrl: './search-user.scss',
  standalone:true
})
export class SearchUser {
 @Output() searchChange = new EventEmitter<string>();

  onSearch(event: any) {
    const value = event.target.value;
    this.searchChange.emit(value);
    console.log(this.searchChange)
  }
}
