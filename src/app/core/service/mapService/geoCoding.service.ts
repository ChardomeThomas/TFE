import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  constructor(private http: HttpClient) {}

  getCoordinates(city: string): Observable<any> {
    const url = `https://nominatim.openstreetmap.org/search?city=${city}&format=json&limit=1`;
    return this.http.get(url);
  }
}
