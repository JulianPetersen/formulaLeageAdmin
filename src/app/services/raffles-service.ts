import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global-service';
import { RaffleDrawResponse, RaffleModel, RaffleStatus } from '../models/raffle';

@Injectable({
  providedIn: 'root',
})
export class RafflesService {
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

  getAllRaffles() {
    return this.http.get<RaffleModel[]>(`${this.global.api}/api/raffles/admin/all`, {
      headers: this.getHeaders(),
    });
  }

  createRaffle(data: FormData) {
    return this.http.post<RaffleModel>(`${this.global.api}/api/raffles`, data, {
      headers: this.getHeaders(),
    });
  }

  updateRaffle(id: string, data: FormData) {
    return this.http.patch<RaffleModel>(`${this.global.api}/api/raffles/${id}`, data, {
      headers: this.getHeaders(),
    });
  }

  updateStatus(id: string, status: RaffleStatus) {
    return this.http.patch<RaffleModel>(
      `${this.global.api}/api/raffles/${id}/status`,
      { status },
      { headers: this.getHeaders() }
    );
  }

  drawRaffle(id: string) {
    return this.http.post<RaffleDrawResponse>(
      `${this.global.api}/api/raffles/${id}/draw`,
      {},
      { headers: this.getHeaders() }
    );
  }
}
