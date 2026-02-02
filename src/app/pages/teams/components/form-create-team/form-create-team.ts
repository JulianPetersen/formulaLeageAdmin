import { Component } from '@angular/core';
import { MenuLateral } from '../../../../shared/menu-lateral/menu-lateral';
import { Header } from '../../../../shared/header/header';
import { CommonModule } from '@angular/common';
import { Toolbar } from '../../../../shared/toolbar/toolbar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TeamsService } from '../../../../services/teams';

@Component({
  selector: 'app-form-create-team',
  imports: [ CommonModule, ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule],
  templateUrl: './form-create-team.html',
  styleUrl: './form-create-team.scss',
})
export class FormCreateTeam {


  loading = false;
  preview: string | null = null;

  form!: FormGroup;



  constructor(public teamService:TeamsService,private fb: FormBuilder,){
    this.form = this.fb.group({
    name: ['', Validators.required],
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

    this.teamService.createTeam(formData)
      .subscribe({
        next: () => {
          this.loading = false;
          alert('Equipo creado!');
          this.form.reset();
          this.preview = null;
        },
        error: () => {
          this.loading = false;
        }
      });
  }


}
