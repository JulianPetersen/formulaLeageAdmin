import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PilotsModel } from '../../../../models/pilots';
import { RACE_EXTRAS } from '../../race-form.utils';

@Component({
  selector: 'app-race-extras-config',
  imports: [ReactiveFormsModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './race-extras-config.html',
  styleUrl: './race-extras-config.scss',
})
export class RaceExtrasConfig {
  @Input() form!: FormGroup;
  @Input() pilots: PilotsModel[] = [];
  readonly extras = RACE_EXTRAS;

  get selectedPilots() {
    const ids: string[] = this.form.get('pilots')?.value || [];
    return this.pilots.filter(pilot => ids.includes(pilot._id));
  }
}
