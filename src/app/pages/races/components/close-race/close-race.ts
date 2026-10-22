import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RacesService } from '../../../../services/races-service';
import { RaceModel } from '../../../../models/race';
import { classificationError, closeRaceReason } from '../../race-form.utils';
import { RaceExtrasSummary } from '../race-extras-summary/race-extras-summary';

@Component({
  selector: 'app-close-race',
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatSelectModule,
    MatFormFieldModule, MatInputModule, RaceExtrasSummary],
  templateUrl: './close-race.html',
  styleUrl: './close-race.scss',
})
export class CloseRace {
  form: FormGroup;
  loading = false;
  blocked = false;
  error = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: RaceModel,
    private fb: FormBuilder, private racesService: RacesService,
    public dialogRef: MatDialogRef<CloseRace>, private cdr: ChangeDetectorRef) {
    this.form = fb.group({
      result: fb.array(data.pilots.map((pilot, index) => fb.group({
        pilot: [pilot._id, Validators.required],
        position: [index + 1, [Validators.required, Validators.min(1), Validators.max(22)]],
      }))),
      confirmed: [false, Validators.requiredTrue],
    });
  }

  get resultArray(): FormArray { return this.form.get('result') as FormArray; }
  get closeReason() { return closeRaceReason(this.data); }

  submit() {
    if (this.loading || this.blocked) return;
    this.form.markAllAsTouched();
    this.error = this.closeReason ||
      classificationError(this.form.value.result, this.data.pilots.map(pilot => pilot._id));
    if (this.error || this.form.invalid) return;
    this.loading = true;
    this.dialogRef.disableClose = true;
    this.racesService.closeRace(this.data._id, this.form.value.result).subscribe({
      next: () => this.dialogRef.close('closed'),
      error: err => {
        this.loading = false;
        this.blocked = true;
        this.dialogRef.disableClose = false;
        this.error = (err.error?.message || 'No se pudo confirmar el cierre.') +
          ' Volvé al listado actualizado para comprobar el estado antes de realizar otra acción.';
        this.cdr.detectChanges();
      },
    });
  }
}
