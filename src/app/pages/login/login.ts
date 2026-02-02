import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../services/auth';
import { loguinResponse } from '../../models/auth';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [MatCardModule, MatProgressSpinnerModule, MatFormFieldModule, MatButtonModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {


  form!: FormGroup;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder,
    public auth: AuthService,
    private router: Router,
  private cdr: ChangeDetectorRef) {

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }


submit() {
  if (this.form.invalid) return;

  this.loading = true;
  this.error = '';

  this.auth.login(this.form.value).subscribe({
    next: (res:loguinResponse) => {
      this.loading = false;

      if (res.user.role === "admin") {
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('token', res.token);

        this.router.navigateByUrl('/admin');
      }

      // si no es admin
      this.error = 'No tiene permisos para ingresar.';
      this.cdr.detectChanges();
    },

    error: (err: any) => {
      this.loading = false;
      this.error = err.error?.message || 'Credenciales incorrectas';
      this.cdr.detectChanges(); 
    }
  });
}
}


