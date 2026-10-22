import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { RaceModel, RacePayload } from '../../../../models/race';
import { RacesService } from '../../../../services/races-service';
import { RaceForm } from '../race-form/race-form';

@Component({
  selector: 'app-edit-race',
  imports: [MatDialogModule, MatButtonModule, RaceForm],
  templateUrl: './edit-race.html',
  styleUrl: './edit-race.scss',
})
export class EditRaceComponent {
  loading = false;
  blocked = false;
  error = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: RaceModel,
    public dialogRef: MatDialogRef<EditRaceComponent>,
    private raceService: RacesService, private cdr: ChangeDetectorRef) {}

  submit(payload: Partial<RacePayload>) {
    if (this.loading || this.blocked) return;
    this.loading = true;
    this.error = '';
    this.dialogRef.disableClose = true;
    this.raceService.updrateRace(this.data._id, payload).subscribe({
      next: () => this.dialogRef.close('updated'),
      error: err => {
        this.loading = false;
        this.blocked = true;
        this.dialogRef.disableClose = false;
        this.error = (err.error?.message || 'No se pudo guardar la carrera.') +
          ' Volvé al listado actualizado antes de editar nuevamente.';
        this.cdr.detectChanges();
      },
    });
  }
}
