import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProspectoService {
  private myAppUrl = 'https://localhost:44326/';
  private myApiUrl = 'api/prospecto/'

  constructor(private http: HttpClient) { }

  getListProspecto(): Observable<any> {
    return this.http.get(this.myAppUrl + this.myApiUrl);
  }

  deleteProspecto(id: number): Observable<any> {
    return this.http.delete(this.myAppUrl + this.myApiUrl + id)
  }

  saveProspecto(prospecto: any): Observable<any> {
    return this.http.post(this.myAppUrl + this.myApiUrl, prospecto);
  }

  updateProspecto(id: number, prospecto: any): Observable<any> {
    return this.http.put(this.myAppUrl + this.myApiUrl + id, prospecto);
  }
}
