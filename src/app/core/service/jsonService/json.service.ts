import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Country } from '../../../interface/country.interface';

@Injectable({
  providedIn: 'root'
})
export class JsonService {
  // private jsonUrl = 'assets/json/data.json';
  private countries = 'https://thomas-chardome.be/ajout-json/countries.json';
  private cities = 'https://thomas-chardome.be/ajout-json/cities.json';
  private days = 'https://thomas-chardome.be/ajout-json/days.json';
  constructor(private http: HttpClient) { }

  getCountries(): Observable<any> {
    return this.http.get<Country[]>(this.countries);
  }

  getCities(): Observable<any> {
    return this.http.get<any>(this.cities);
  }

  getDays(): Observable<any> {
    return this.http.get<any>(this.days);
  }
}
