import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatOption, MatSelect } from '@angular/material/select';
import { TeamsService } from '../../../../services/teams';

import { TeamsModel } from '../../../../models/teams';
import { PilotsServices } from '../../../../services/pilots-services';

@Component({
  selector: 'app-form-create-pilot-component',
  imports: [CommonModule, ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSelect,
    MatOption],
  templateUrl: './form-create-pilot-component.html',
  styleUrl: './form-create-pilot-component.scss',
})
export class FormCreatePilotComponent {


  loading = false;
  preview: string | null = null;

  form!: FormGroup;
  disableSelect = new FormControl(false);
  allTeams: TeamsModel[] = [];


  constructor(private fb: FormBuilder, private teamService: TeamsService, public pilotService:PilotsServices) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      number: [null, Validators.required],
      img: [null],
      team: ['', Validators.required],
      country:['', Validators.required]
    });

    this.getAllTeams();
  }



  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.form.patchValue({ img: file });

    const reader = new FileReader();
    reader.onload = () => this.preview = reader.result as string;
    reader.readAsDataURL(file);

  }


  getAllTeams() {
    this.teamService.getAllTeams().subscribe({
      next: ((res: TeamsModel[]) => {
        this.allTeams = res
        console.log('los equipos son', this.allTeams);
      }),
      error: ((err) => {
        console.log(err)
      })
    })
  }

  onSubmit() {

    if (this.form.invalid) return;

    const formData = new FormData();
    formData.append('name', this.form.value.name!);
    formData.append('number', this.form.value.number.toString());
    formData.append('team', this.form.value.team);
    formData.append('country', this.form.value.country);
    if (this.form.value.img) {
      formData.append('img', this.form.value.img);
    }

    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }
    this.loading = true;

    this.pilotService.createPilot(formData)
      .subscribe({
        next: () => {
          this.loading = false;
         
          this.form.reset();
          this.preview = null;
          this.pilotService.notifyManagmentAdded()
        },
        error: () => {
          this.loading = false;
        }
      });
  }
}
