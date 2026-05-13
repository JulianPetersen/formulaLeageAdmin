import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { PilotsModel } from '../../../../models/pilots';
import { TracksModel } from '../../../../models/tracks';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UpdatePilotComponent } from '../../../pilots/component/update-pilot-component/update-pilot-component';
import { TrackService } from '../../../../services/track-service';
import { RaceModel } from '../../../../models/race';
import { PilotsServices } from '../../../../services/pilots-services';
import { RacesService } from '../../../../services/races-service';

@Component({
  selector: 'app-edit-race',
  imports: [ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    CommonModule],
  templateUrl: './edit-race.html',
  styleUrl: './edit-race.scss',
})
export class EditRaceComponent {
  form!: FormGroup;
  loading = false;
  error = '';

  pilots: PilotsModel[] = [];
  tracks: TracksModel[] = [];


  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: RaceModel,
    private dialogRef: MatDialogRef<UpdatePilotComponent>,
    private tracksService: TrackService,
    private cdr: ChangeDetectorRef,
    private pilotsService: PilotsServices,
    private raceService: RacesService
  ) {

    this.form = this.fb.group({
      name: ['', Validators.required],
      circuit: ['', Validators.required],
      date: ['', Validators.required],
      cutoff: [''],
      pilots: [[], Validators.required],
    });

    console.log('la data del piloto es', this.data)
    this.loadData();
  }


  ngOnInit() {
    console.log('la fecha es',this.data.date)
    this.form = this.fb.group({
      name: [this.data.name, Validators.required],
      circuit: [this.data.circuit._id, Validators.required],
      date: [this.formatDate(this.data.date), Validators.required],
    cutoff: [this.formatDate(this.data.cutoff), Validators.required],
      pilots: [this.data.pilots?.map(p => p._id || p)]
    });


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
    this.raceService.updrateRace(this.data._id, this.form.value as any).subscribe({
      next: (res) => {
        this.loading = false;
        console.log(res)
        this.raceService.notifyManagmentAdded()
        this.loading = false;
        this.dialogRef.close('updated')
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Error al crear la carrera';
        // this.cdr.detectChanges();
      }
    });
  }

  private formatDate(date: string | Date): string {
  const d = new Date(date);
  const pad = (n: number) => n.toString().padStart(2, '0');

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
}
