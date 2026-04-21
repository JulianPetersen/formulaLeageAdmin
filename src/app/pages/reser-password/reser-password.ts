import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reser-password',
  imports: [CommonModule,FormsModule],
  templateUrl: './reser-password.html',
  styleUrl: './reser-password.scss',
})
export class ReserPassword {
 password: string = '';
  message: string = '';
  token: string = '';
  loading = false;
  invalidToken = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (!this.token) {
      this.invalidToken = true;
      this.message = 'Token inválido ❌';
    }
  }

  reset() {
    if (!this.password) {
      this.message = 'Ingresá una contraseña';
      return;
    }

    this.loading = true;

    this.http.post('https://formulaleague.site/api/auth/resetpassword', {
      token: this.token,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        this.message = res.message;
        this.loading = false;

        // 🔥 redirigir a login
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.message = err.error.message;
        this.invalidToken = true;
        this.loading = false;
      }
    });
  }
}
