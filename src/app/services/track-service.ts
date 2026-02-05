import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GlobalService } from './global-service';
import { TracksModel } from '../models/tracks';

@Injectable({
  providedIn: 'root',
})
export class TrackService {

  constructor(private http: HttpClient, private global: GlobalService) { }

  private tracksAddedSource = new Subject<void>();
  tracksAdded$ = this.tracksAddedSource.asObservable(); // <-- observable público

  getToken(): string | null {
    return localStorage.getItem('token');
  }


  ceateTrack(formData: FormData) {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
    return this.http.post(`${this.global.api}/api/track`, formData, { headers });
  }


  getAllTracks() {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
    return this.http.get<TracksModel[]>(`${this.global.api}/api/track`, { headers });
  }

  deleteTrack(id: string) {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
    return this.http.delete(`${this.global.api}/api/track/${id}`, { headers })
  }


  updateTrack(formData: FormData, id: string) {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
    return this.http.patch(`${this.global.api}/api/track/${id}`, formData, { headers });
  }


  notifyManagmentAdded() {
    this.tracksAddedSource.next();
  }
}
