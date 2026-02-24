import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { RacesService } from '../../../../services/races-service';
import { RaceModel } from '../../../../models/race';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-close-race',
 imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule
  ],
  templateUrl: './close-race.html',
  styleUrl: './close-race.scss',
})
export class CloseRace {

   form: FormGroup;
  loading = false;
  error = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: RaceModel,
    private fb: FormBuilder,
    private racesService: RacesService,
    private dialogRef: MatDialogRef<CloseRace>
  ) {
    this.form = this.fb.group({
      result: this.fb.array([])
    });

    console.log('la data es',this.data)
    this.initForm();
  }

   get resultArray(): FormArray {
    return this.form.get('result') as FormArray;
  }

  initForm() {
    this.data.pilots.forEach((pilot, index) => {
      this.resultArray.push(
        this.fb.group({
          pilot: [pilot._id, Validators.required],
          position: [index + 1, Validators.required]
        })
      );
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;

    this.racesService.closeRace(this.data._id, this.form.value.result)
      .subscribe({
        next: () => {
          this.dialogRef.close('closed');
        },
        error: err => {
          this.loading = false;
          this.error = err.error?.message || 'Error al cerrar la carrera';
        }
      });
  }
}

