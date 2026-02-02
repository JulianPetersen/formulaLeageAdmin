import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TeamsService } from '../../../../services/teams';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TeamsModel } from '../../../../models/teams';

@Component({
  selector: 'app-update-team',
  imports: [CommonModule, ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule],
  templateUrl: './update-team.html',
  styleUrl: './update-team.scss',
})
export class UpdateTeam {

  loading = false;
  preview: string | null = null;

  form!: FormGroup;




  constructor(public teamService: TeamsService, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: TeamsModel,
    private dialogRef: MatDialogRef<UpdateTeam>) {

    this.form = this.fb.group({
      name: ['', Validators.required],
      img: [null]
    });

      console.log(this.data);
  }

ngOnInit() {
  this.form = this.fb.group({
    name: [this.data.name, Validators.required],
    img: [null]
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

    this.loading = true;

    this.teamService.updateTeam(formData,this.data._id)
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
