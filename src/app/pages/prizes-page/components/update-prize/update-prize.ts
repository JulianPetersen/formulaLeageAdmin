import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrizesService } from '../../../../services/prizes-service';
import { PrizeModel } from '../../../../models/prize-model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {  MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-update-prize',
  imports: [CommonModule, ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatFormFieldModule],
  templateUrl: './update-prize.html',
  styleUrl: './update-prize.scss',
  standalone: true,
})
export class UpdatePrize {


  loading = false;
  preview: string | null = null;
  error = '';
  form!: FormGroup;

constructor(
  public prizeService: PrizesService,
  private fb: FormBuilder,
  @Inject(MAT_DIALOG_DATA) public data: PrizeModel,
  private dialogRef: MatDialogRef<UpdatePrize>
) {
  console.log(data)
  this.form = this.fb.group({
    amount: [this.data.amount, Validators.required],
    endDate: [this.data.endDate],
    winner: [this.data.winner],
  });
}


ngOnInit() {
  this.form = this.fb.group({
    amount: [this.data.amount, Validators.required],
    endDate: [this.data.amount, Validators.required],
    winner: [this.data.winner],
  });

  
}


  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';

    // 🚨 Enviamos OBJETO PLANO, no FormData
    this.prizeService.updatePrizeData(this.data._id, this.form.value as any).subscribe({
      next: (res) => {
        this.loading = false;
        console.log(res)
        this.prizeService.notifyManagmentAdded()
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
}
