import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TrackService } from '../../../../services/track-service';

@Component({
  selector: 'app-create-track',
  imports: [ CommonModule, ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule],
  templateUrl: './create-track.html',
  styleUrl: './create-track.scss',
})
export class CreateTrack {

    loading = false;
  preview: string | null = null;

  form!: FormGroup;



  constructor(public trackService:TrackService,private fb: FormBuilder,){
    this.form = this.fb.group({
    name: ['', Validators.required],
    country:['', Validators.required],
    img: [null]
  });
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

    this.loading = true;

    this.trackService.ceateTrack(formData)
      .subscribe({
        next: () => {
          this.loading = false;
          this.form.reset();
          this.preview = null;
          this.trackService.notifyManagmentAdded()
        },
        error: () => {
          this.loading = false;
        }
      });
  }

}