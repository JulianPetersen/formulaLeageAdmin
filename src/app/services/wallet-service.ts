import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global-service';
import { WalletClaim, WalletClaimStatus, WalletClaimStatusUpdate } from '../models/wallet';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
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

  getClaims(status?: WalletClaimStatus | 'all') {
    let params = new HttpParams();

    if (status && status !== 'all') {
      params = params.set('status', status);
    }

    return this.http.get<WalletClaim[]>(`${this.global.api}/api/wallet/claims`, {
      headers: this.getHeaders(),
      params,
    });
  }

  updateClaimStatus(id: string, data: WalletClaimStatusUpdate) {
    return this.http.patch<WalletClaim>(`${this.global.api}/api/wallet/claims/${id}`, data, {
      headers: this.getHeaders(),
    });
  }
}
