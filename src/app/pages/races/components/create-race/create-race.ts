import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PilotsModel } from '../../../../models/pilots';
import { TracksModel } from '../../../../models/tracks';
import { RacesService } from '../../../../services/races-service';
import { PilotsServices } from '../../../../services/pilots-services';
import { TrackService } from '../../../../services/track-service';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-create-race',
  imports: [    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
  CommonModule],
  templateUrl: './create-race.html',
  styleUrl: './create-race.scss',
})
export class CreateRace {
  form!: FormGroup;
  loading = false;
  error = '';

  pilots: PilotsModel[] = [];
  tracks: TracksModel[] = [];



    constructor(
    private fb: FormBuilder,
    private racesService: RacesService,
    private pilotsService: PilotsServices,
    private tracksService: TrackService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      circuit: ['', Validators.required],
      date: ['', Validators.required],
      cutoff: [''],
      pilots: [[], Validators.required],
    });

    this.loadData();
  }

  loadData() {
    this.pilotsService.getAllPilots().subscribe(res => {
      this.pilots = res;
      this.cdr.detectChanges();
    });

    this.tracksService.getAllTracks().subscribe(res => {
      this.tracks = res;
      this.cdr.detectChanges();
    });
  }


  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';

    // 🚨 Enviamos OBJETO PLANO, no FormData
    this.racesService.createRace(this.form.value as any).subscribe({
      next: (res) => {
        this.loading = false;
        console.log(res)
        this.racesService.notifyManagmentAdded()
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Error al crear la carrera';
        this.cdr.detectChanges();
      }
    });
  }
}

