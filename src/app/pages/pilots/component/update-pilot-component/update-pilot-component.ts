import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeamsService } from '../../../../services/teams';
import { TeamsModel } from '../../../../models/teams';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PilotsServices } from '../../../../services/pilots-services';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOption, MatSelect } from '@angular/material/select';
import { PilotsModel } from '../../../../models/pilots';

@Component({
  selector: 'app-update-pilot-component',
  imports: [CommonModule, ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSelect,
    MatOption],
  templateUrl: './update-pilot-component.html',
  styleUrl: './update-pilot-component.scss',
})




export class UpdatePilotComponent {

  allTeams: TeamsModel[] = [];
  loading = false;
  preview: string | null = null;

  form!: FormGroup;


    constructor(public teamService: TeamsService, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: PilotsModel,
    private dialogRef: MatDialogRef<UpdatePilotComponent>,
    private pilotService:PilotsServices) {

    this.form = this.fb.group({
      name: ['', Validators.required],
      number: [null, Validators.required],
      img: [null],
      team: ['', Validators.required],
      country:['', Validators.required]
    });
    console.log('la data del piloto es', this.data)
      this.getAllTeams();
  }


  ngOnInit() {
  this.form = this.fb.group({
    name: [this.data.name, Validators.required],
    number: [this.data.number, Validators.required],
    img: [null],
    team:[this.data.team._id, Validators.required],
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
    if (this.form.value.img) {
      formData.append('img', this.form.value.img);
    }
    formData.append('number', this.form.value.number!);
    formData.append('team', this.form.value.team!);
    formData.append('country', this.form.value.country!);
    this.loading = true;

    this.pilotService.updatePilot(formData,this.data._id)
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
