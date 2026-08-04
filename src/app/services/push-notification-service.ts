import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global-service';

export interface PushNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

export interface PushNotificationResponse {
  ok: boolean;
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  constructor(private http: HttpClient, private global: GlobalService) {}

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getHeaders() {
    const token = this.getToken();

    return new HttpHeaders({
      authorization: `Bearer ${token}` || '',
    });
  }

  sendPush(payload: PushNotificationPayload) {
    return this.http.post<PushNotificationResponse>(
      `${this.global.api}/api/pushnotification`,
      payload,
      { headers: this.getHeaders() }
    );
  }
}
