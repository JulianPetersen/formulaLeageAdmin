import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global-service';
import { PrizeModel } from '../models/prize-model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PrizesService {


  constructor(private http: HttpClient, private global: GlobalService) {

  }


  private prizesAddedSource = new Subject<void>();
  prizesAdded$ = this.prizesAddedSource.asObservable(); // <-- observable público


  getToken(): string | null {

    return localStorage.getItem('token');
  }


  createPrize(formData: FormData) {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
    return this.http.post(`${this.global.api}/api/prize`, formData, { headers });
  }


  getAllPrizes(){
    const token = this.getToken()
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });

    return this.http.get <PrizeModel[]>(`${this.global.api}/api/prize/allPrizes`, { headers });
  }


    changeStatusToActive(id:string, status:string){
    const token = this.getToken()
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });

    return this.http.patch(`${this.global.api}/api/prize/changeStatusToActive/${id}`, {status},{ headers });
  }


  updatePrizeData(id:string, data: PrizeModel){
    const token = this.getToken()
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });

    return this.http.patch(`${this.global.api}/api/prize/${id}`,data,{ headers });
  }


  notifyManagmentAdded() {
    this.prizesAddedSource.next();
  }
}
