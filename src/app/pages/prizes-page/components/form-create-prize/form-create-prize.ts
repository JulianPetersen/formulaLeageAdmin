import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PrizesService } from '../../../../services/prizes-service';

@Component({
  selector: 'app-form-create-prize',
  imports: [MatCard,MatFormField,MatLabel,CommonModule,MatProgressSpinner,ReactiveFormsModule,MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
  CommonModule
  
  ],
  templateUrl: './form-create-prize.html',
  styleUrl: './form-create-prize.scss',
})
export class FormCreatePrize {


    loading = false;
    preview: string | null = null;
    error = '';
    form!: FormGroup;
    disableSelect = new FormControl(false);
    
  
  
    constructor(private fb: FormBuilder, private prizeService:PrizesService) {
      this.form = this.fb.group({
        amount: ['', Validators.required],
        endDate: ['', Validators.required],

      });
  
      
    }
  

    onSubmit(){
          if (this.form.invalid) return;

    this.loading = true;
    this.error = '';

    // 🚨 Enviamos OBJETO PLANO, no FormData
    this.prizeService.createPrize(this.form.value as any).subscribe({
      next: (res) => {
        this.loading = false;
        console.log(res)
        this.prizeService.notifyManagmentAdded()
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Error al crear la carrera';
        // this.cdr.detectChanges();
      }
    });
    }

}
