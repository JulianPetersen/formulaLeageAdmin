import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify',
  imports: [],
  templateUrl: './verify.html',
  styleUrl: './verify.scss',
})
export class Verify {
message = 'Verificando cuenta...';
  success = false;

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
          this.cdr.detectChanges(); // 👈 clave
        }
      });
  }
}
