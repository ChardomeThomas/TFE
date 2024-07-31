import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FeatureCollection } from 'geojson';  // Assurez-vous que `@types/geojson` est installé

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private hongKongUrl = 'assets/json/hong-kong.geojson';
  private worldUrl = 'assets/json/ne_10m_admin_0_countries.geojson';

  constructor(private http: HttpClient) { }

  getHongKongData(): Observable<FeatureCollection> {
    return this.http.get<FeatureCollection>(this.hongKongUrl);
  }

  getWorldData(): Observable<FeatureCollection> {
    return this.http.get<FeatureCollection>(this.worldUrl);
  }
}
