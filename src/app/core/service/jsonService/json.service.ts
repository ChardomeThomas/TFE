import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Country2 } from '../../../interface/country.interface';

@Injectable({
  providedIn: 'root'
})
export class JsonService {
  private countries = 'https://thomas-chardome.be/ajout-json/countries.json';
  private cities = 'https://thomas-chardome.be/ajout-json/cities.json';
  private days = 'https://thomas-chardome.be/ajout-json/days.json';
  private photosUrl = 'https://thomas-chardome.be/ajout-json/photos.json';
  constructor(private http: HttpClient) { }
  
  getCountries(): Observable<any> {
    return this.http.get<Country2[]>(this.countries);
  }
  
  getCities(): Observable<any> {
    return this.http.get<any>(this.cities);
  }
  
  getDays(): Observable<any> {
    return this.http.get<any>(this.days);
  }
  getPhotos(): Observable<any> {
    return this.http.get<any>(this.photosUrl); // Remplacer par l'URL appropriée
  }
  
  //pour la carte leaflet
  // private jsonUrl = 'assets/json/data.json';
  //    getJsonData(): Observable<any> {
  //      return this.http.get<Country[]>(this.jsonUrl);
  //    }
}
