import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Header } from '../../shared/header/header';
import { MenuLateral } from '../../shared/menu-lateral/menu-lateral';
import { Toolbar } from '../../shared/toolbar/toolbar';
import { PushNotificationPayload, PushNotificationService } from '../../services/push-notification-service';

@Component({
  selector: 'app-push-notifications',
  imports: [
    CommonModule,
    FormsModule,
    Header,
    Toolbar,
    MenuLateral,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './push-notifications.html',
  styleUrl: './push-notifications.scss',
})
export class PushNotifications {
  title = '';
  body = '';
  dataText = '';
  loading = false;
  error = '';
  success = '';

  constructor(
    private pushService: PushNotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  get canSend() {
    return this.title.trim().length > 0 && this.body.trim().length > 0 && !this.loading;
  }

  sendPush() {
    if (!this.title.trim() || !this.body.trim()) {
      this.error = 'Completa titulo y mensaje';
      this.success = '';
      return;
    }

    const data = this.parseData();

    if (data === null) {
      this.error = 'El campo data debe ser un JSON valido';
      this.success = '';
      return;
    }

    const payload: PushNotificationPayload = {
      title: this.title.trim(),
      body: this.body.trim(),
      data,
    };

    this.loading = true;
    this.error = '';
    this.success = '';

    this.pushService.sendPush(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = res.message || 'Push enviada correctamente';
        this.resetForm();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || err.error?.error || 'No se pudo enviar la push';
        this.cdr.detectChanges();
      },
    });
  }

  private parseData(): Record<string, string> | null {
    const value = this.dataText.trim();

    if (!value) return {};

    try {
      const parsed = JSON.parse(value);

      if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
        return null;
      }

      return Object.entries(parsed).reduce<Record<string, string>>((acc, [key, item]) => {
        acc[key] = String(item);
        return acc;
      }, {});
    } catch (error) {
      return null;
    }
  }

  private resetForm() {
    this.title = '';
    this.body = '';
    this.dataText = '';
  }
}
