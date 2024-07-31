import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from '../../../core/service/mapService/map.service';
import { FeatureCollection } from 'geojson';
@Component({
  selector: 'app-leaflet-map',
  standalone: true,
  imports: [],
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.css'],
  schemas: []
})
export class LeafletMapComponent implements AfterViewInit {
  private map!: L.Map;

  constructor(private mapService: MapService) {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      worldCopyJump: true,
      maxBounds: [[-90, -180], [90, 180]]
    }).setView([50, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      noWrap: true
    }).addTo(this.map);

    this.loadGeoJSON();
  }

  private loadGeoJSON(): void {
    // Définir les styles pour les pays visités
    const getColor = (country: string): string | null => {
      switch (country) {
        case 'Poland': return '#FF0000';
        case 'Germany': return '#00FF00';
        case 'Belgium': return '#0000FF';
        case 'Hong Kong': return '#FFFF00';
        default: return null;
      }
    };

    const style = (feature: any): L.PathOptions => {
      const color = getColor(feature.properties.ADMIN);
      if (color) {
        return {
          fillColor: color,
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.7
        };
      } else {
        return {};
      }
    };

    // Utiliser le service pour récupérer les données GeoJSON des pays du monde
    this.mapService.getWorldData().subscribe(
      (data: FeatureCollection) => {
        L.geoJSON(data, {
          style: style,
          onEachFeature: (feature, layer) => {
            layer.on('click', (e) => {
              this.map.fitBounds(e.target.getBounds());
            });
          }
        }).addTo(this.map);
      },
      (error) => {
        console.error('Erreur lors du chargement des données GeoJSON:', error);
      }
    );

    // Utiliser le service pour récupérer les données GeoJSON pour Hong Kong
    this.mapService.getHongKongData().subscribe(
      (data: FeatureCollection) => {
        L.geoJSON(data, {
          style: (feature) => {
            return {
              fillColor: '#FFFF00',
              weight: 2,
              opacity: 1,
              color: 'white',
              dashArray: '3',
              fillOpacity: 0.7
            };
          },
          onEachFeature: (feature, layer) => {
            layer.on('click', (e) => {
              this.map.fitBounds(e.target.getBounds());
            });
          }
        }).addTo(this.map);
      },
      (error) => {
        console.error('Erreur lors du chargement des données GeoJSON:', error);
      }
    );
    const hongKongLatLng = L.latLng(22.3193, 114.1694);  // Coordonnées de Hong Kong
    const marker = L.marker(hongKongLatLng).addTo(this.map);
    marker.on('click', () => {
      this.map.setView(hongKongLatLng, 10);  // Zoomer à un niveau 10
      marker.openPopup();  // Ouvrir la popup du marqueur
    });
  }
  
}