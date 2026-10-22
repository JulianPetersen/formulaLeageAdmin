import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PilotsModel } from '../../../../models/pilots';
import { TracksModel } from '../../../../models/tracks';
import { RaceModel, RacePayload } from '../../../../models/race';
import { PilotsServices } from '../../../../services/pilots-services';
import { TrackService } from '../../../../services/track-service';
import { RaceExtrasConfig } from '../race-extras-config/race-extras-config';
import { createRaceForm, racePayload, rulesLocked } from '../../race-form.utils';

@Component({
  selector: 'app-race-form',
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, RaceExtrasConfig],
  templateUrl: './race-form.html',
  styleUrl: './race-form.scss',
})
export class RaceForm implements OnInit {
  @Input() race?: RaceModel;
  @Input() saving = false;
  @Input() blocked = false;
  @Input() error = '';
  @Output() saveRace = new EventEmitter<Partial<RacePayload>>();
  form!: FormGroup;
  pilots: PilotsModel[] = [];
  tracks: TracksModel[] = [];
  loading = true;
  loadError = '';
  get locked() { return rulesLocked(this.race); }

  constructor(private fb: FormBuilder, private pilotsService: PilotsServices,
    private tracksService: TrackService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.form = createRaceForm(this.fb, this.race);
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.loadError = '';
    this.pilotsService.getAllPilots().subscribe({
      next: pilots => {
        this.pilots = pilots;
        this.tracksService.getAllTracks().subscribe({
          next: tracks => { this.tracks = tracks; this.loading = false; this.cdr.detectChanges(); },
          error: () => this.onLoadError(),
        });
      },
      error: () => this.onLoadError(),
    });
  }

  private onLoadError() {
    this.loading = false;
    this.loadError = 'No se pudieron cargar pilotos y circuitos.';
    this.cdr.detectChanges();
  }

  reset() {
    this.form = createRaceForm(this.fb);
    this.cdr.detectChanges();
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.saving || this.blocked || this.loading || this.loadError) return;
    this.saveRace.emit(racePayload(this.form, this.locked));
  }
}
