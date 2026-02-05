import { Component, Inject } from '@angular/core';
import { TrackService } from '../../../../services/track-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TracksModel } from '../../../../models/tracks';
import { UpdatePilotComponent } from '../../../pilots/component/update-pilot-component/update-pilot-component';
import { PilotsServices } from '../../../../services/pilots-services';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-update-track',
  imports: [CommonModule, ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ],
  templateUrl: './update-track.html',
  styleUrl: './update-track.scss',
})
export class UpdateTrack {


  loading = false;
  preview: string | null = null;

  form!: FormGroup;

  constructor(public trackService: TrackService, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: TracksModel,
    private dialogRef: MatDialogRef<UpdatePilotComponent>,
    private pilotService:PilotsServices) {

    this.form = this.fb.group({
      name: ['', Validators.required],
      img: [null],
      country:['', Validators.required]
    });
    console.log('la data del piloto es', this.data)
      
  }


ngOnInit() {
  this.form = this.fb.group({
    name: [this.data.name, Validators.required],
    img: [null],
    country:[this.data.country, Validators.required],
  });

  this.preview = this.data.img;
}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.form.patchValue({ img: file });

    const reader = new FileReader();
    reader.onload = () => this.preview = reader.result as string;
    reader.readAsDataURL(file);

  }



onSubmit() {
    if (this.form.invalid) return;

    const formData = new FormData();
    formData.append('name', this.form.value.name!);
    if (this.form.value.img) {
      formData.append('img', this.form.value.img);
    }
    formData.append('country', this.form.value.country!);
    this.loading = true;

    this.trackService.updateTrack(formData,this.data._id)
      .subscribe({
        next: () => {
          this.loading = false;
          this.form.reset();
          this.preview = null;
          this.dialogRef.close('updated')
        },
        error: () => {
          this.loading = false;
        }
      });
  }

}
