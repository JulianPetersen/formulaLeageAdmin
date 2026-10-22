import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ExtraKey, ExtraResult, RaceModel } from '../../../../models/race';
import { RacesService } from '../../../../services/races-service';
import { RACE_EXTRAS } from '../../race-form.utils';

@Component({
  selector: 'app-race-extra-results',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule,
    MatFormFieldModule, MatSelectModule],
  templateUrl: './race-extra-results.html',
  styleUrl: './race-extra-results.scss',
})
export class RaceExtraResults {
  form: FormGroup;
  readonly extras = RACE_EXTRAS;
  saving: ExtraKey | null = null;
  blocked = false;
  error = '';
  success = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: RaceModel,
    private fb: FormBuilder, private racesService: RacesService,
    public dialogRef: MatDialogRef<RaceExtraResults>, private cdr: ChangeDetectorRef) {
    const groups: Record<string, FormGroup> = {};
    for (const extra of this.extras) {
      const result = data.extraResults?.[extra.key];
      groups[extra.key] = fb.group({
        status: [result?.status || 'pending'],
        value: [result?.value ?? null],
      });
    }
    this.form = fb.group(groups);
    if (data.status !== 'lista') this.form.disable();
  }

  availablePilots(key: ExtraKey) {
    return key === 'duel'
      ? this.data.pilots.filter(pilot => this.data.extras?.duel?.pilots?.includes(pilot._id))
      : this.data.pilots;
  }

  canEdit(key: ExtraKey): boolean {
    return this.data.status === 'lista' && !!this.data.extras?.[key]?.enabled &&
      Date.now() >= new Date(this.data.extras[key].cutoff).getTime();
  }

  validResult(key: ExtraKey): boolean {
    const result = this.form.get(key)?.value as ExtraResult;
    if (result.status === 'void') return true;
    if (result.status !== 'resolved') return false;
    return key === 'safetyCar' ? typeof result.value === 'boolean'
      : this.availablePilots(key).some(pilot => pilot._id === result.value);
  }

  save(key: ExtraKey) {
    if (this.saving || this.blocked || !this.canEdit(key) || !this.validResult(key)) return;
    const selected = this.form.get(key)?.value as ExtraResult;
    const result: ExtraResult = selected.status === 'void'
      ? { status: 'void' } : { status: 'resolved', value: selected.value };
    this.saving = key;
    this.error = '';
    this.success = '';
    this.dialogRef.disableClose = true;
    this.racesService.updateExtraResults(this.data._id, { [key]: result }).subscribe({
      next: race => {
        this.data = { ...this.data, extraResults: race.extraResults };
        this.saving = null;
        this.dialogRef.disableClose = false;
        this.success = 'Resultado guardado. Los puntos se calculan al cerrar la carrera.';
        this.cdr.detectChanges();
      },
      error: err => {
        this.saving = null;
        this.blocked = true;
        this.dialogRef.disableClose = false;
        this.error = (err.error?.message || 'No se pudo guardar el resultado.') +
          ' Volvé al listado actualizado antes de intentarlo otra vez.';
        this.cdr.detectChanges();
      },
    });
  }
}
