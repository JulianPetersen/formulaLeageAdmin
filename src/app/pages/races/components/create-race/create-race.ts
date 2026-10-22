import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RacePayload } from '../../../../models/race';
import { RacesService } from '../../../../services/races-service';
import { RaceForm } from '../race-form/race-form';

@Component({
  selector: 'app-create-race',
  imports: [MatCardModule, RaceForm],
  templateUrl: './create-race.html',
  styleUrl: './create-race.scss',
})
export class CreateRace {
  @ViewChild(RaceForm) raceForm!: RaceForm;
  loading = false;
  blocked = false;
  error = '';
  success = '';

  constructor(private racesService: RacesService, private cdr: ChangeDetectorRef) {}

  submit(payload: Partial<RacePayload>) {
    if (this.loading || this.blocked) return;
    this.loading = true;
    this.error = '';
    this.success = '';
    this.racesService.createRace(payload as RacePayload).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Carrera creada. Revisá sus reglas antes de abrir los pronósticos.';
        this.raceForm.reset();
        this.racesService.notifyManagmentAdded();
        this.cdr.detectChanges();
      },
      error: err => {
        this.loading = false;
        this.blocked = err.status === 0 || err.status >= 500;
        this.error = err.error?.message || 'No se pudo crear la carrera.';
        if (this.blocked) this.error += ' Actualizá la página y revisá el listado antes de volver a crearla.';
        this.racesService.notifyManagmentAdded();
        this.cdr.detectChanges();
      },
    });
  }
}
