import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global-service';
import { ExtraResults, RaceModel, RacePayload, RacePosition } from '../models/race';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RacesService {
  private racesAddedSource = new Subject<void>();
  racesAdded$ = this.racesAddedSource.asObservable();

  constructor(private http: HttpClient, public global: GlobalService) {}

  getToken(): string | null { return localStorage.getItem('token'); }

  private headers() {
    return new HttpHeaders({ authorization: 'Bearer ' + this.getToken() });
  }

  createRace(data: RacePayload) {
    return this.http.post<RaceModel>(this.global.api + '/api/race', data, { headers: this.headers() });
  }

  getAllRaces() {
    return this.http.get<RaceModel[]>(this.global.api + '/api/race', { headers: this.headers() });
  }

  closeRace(raceId: string, result: RacePosition[]) {
    return this.http.put(this.global.api + '/api/race/' + raceId + '/close',
      { result }, { headers: this.headers() });
  }

  updateExtraResults(raceId: string, extraResults: ExtraResults) {
    return this.http.put<RaceModel>(this.global.api + '/api/race/' + raceId + '/extras/results',
      { extraResults }, { headers: this.headers() });
  }

  notifyManagmentAdded() { this.racesAddedSource.next(); }

  updateRaceStatus(id: string, status: string) {
    return this.http.patch<RaceModel>(this.global.api + '/api/race/' + id,
      { status }, { headers: this.headers() });
  }

  updrateRace(id: string, data: Partial<RacePayload>) {
    return this.http.patch<RaceModel>(this.global.api + '/api/race/' + id,
      data, { headers: this.headers() });
  }
}
