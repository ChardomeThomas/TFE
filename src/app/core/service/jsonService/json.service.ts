import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Country } from '../../../interface/country.interface';

@Injectable({
  providedIn: 'root'
})
export class JsonService {
  private jsonUrl = 'assets/json/data.json';
  constructor(private http: HttpClient) { }

  getJsonData(): Observable<any> {
    return this.http.get<Country[]>(this.jsonUrl);
  }
}
