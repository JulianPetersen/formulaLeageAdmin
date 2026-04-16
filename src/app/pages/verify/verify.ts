import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify',
  imports: [CommonModule,FormsModule],
  templateUrl: './verify.html',
  styleUrl: './verify.scss',
})
export class Verify {
  message = 'Verificando cuenta...';
  success = false;
  email:'';
  showResend = false;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.message = 'Token inválido ❌';
      this.cdr.detectChanges();
      return;
    }

    this.http.get(`https://formulaleague.site/api/auth/verify?token=${token}`)
      .subscribe({
        next: (res) => {
          this.message = 'Cuenta verificada correctamente ✅';
          this.success = true;
          this.cdr.detectChanges(); // 👈 clave
          console.log(res)
        },
        error: (err) => {
            console.log(err)
            this.message = 'Token inválido o expirado ❌';
            this.showResend = true;
          this.cdr.detectChanges(); // 👈 clave
        }
      });
  }

  resend(){
  this.http.post('https://formulaleague.site/api/auth/resendVerify', {
    email: this.email
  }).subscribe({
    next: () => alert('Mail reenviado'),
    error: (err) => alert(err.error.msg)
  });
}


}


