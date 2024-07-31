import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from '../../../core/service/mapService/map.service';
import { JsonService } from '../../../core/service/jsonService/json.service';
import { FeatureCollection } from 'geojson';
import { Country } from '../../../interface/country.interface';
import { GeocodingService } from '../../../core/service/mapService/geoCoding.service';

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
  private visitedCountries: Set<string> = new Set();
  private cityMarkers: L.Marker[] = [];  // Pour stocker les marqueurs de villes
  private countryLayers: L.LayerGroup = L.layerGroup(); // Pour stocker les couches de pays
  private jsonData: Country[] = [];  // Stocker les données JSON pour les utiliser lors du zoom

  constructor(
    private mapService: MapService,
    private jsonService: JsonService,
    private geocodingService: GeocodingService
  ) {}

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

    this.countryLayers.addTo(this.map);

    this.loadVisitedCountries();
    this.map.on('zoomend moveend', this.handleMapMoveEnd.bind(this));
  }

  private loadVisitedCountries(): void {
    this.jsonService.getJsonData().subscribe(
      (data: Country[]) => {
        this.jsonData = data;  // Stocker les données JSON
        data.forEach(country => this.visitedCountries.add(country.country));
        this.loadGeoJSON();
        this.loadHongKongData();  // Charger les données spécifiques de Hong Kong
      },
      (error) => {
        console.error('Erreur lors du chargement des données JSON:', error);
      }
    );
  }

  private loadGeoJSON(): void {
    const getColor = (country: string): string | null => {
      if (country === 'Hong Kong') {
        return '#FFFF00';  // Couleur spécifique pour Hong Kong
      }
      if (this.visitedCountries.has(country)) {
        return '#FF0000';  // Couleur pour les autres pays visités
      }
      return null;
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
            if (this.visitedCountries.has(feature.properties.ADMIN) || feature.properties.ADMIN === 'Hong Kong') {
              layer.on('click', (e) => {
                this.map.fitBounds(e.target.getBounds());
                this.addCityMarkers(feature.properties.ADMIN);
              });
              this.countryLayers.addLayer(layer); // Ajout de la couche au LayerGroup
            }
          }
        }).addTo(this.map);
      },
      (error) => {
        console.error('Erreur lors du chargement des données GeoJSON:', error);
      }
    );

    // Écouter l'événement de dézoom pour enlever les marqueurs de ville
    this.map.on('zoomend', () => {
      if (this.map.getZoom() < 5) {
        this.clearCityMarkers();
      }
    });
  }

  private loadHongKongData(): void {
    this.mapService.getHongKongData().subscribe(
      (data: FeatureCollection) => {
        const hongKongLayer = L.geoJSON(data, {
          style: {
            fillColor: '#FFFF00',  // Couleur spécifique pour Hong Kong
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
          },
          onEachFeature: (feature, layer) => {
            layer.on('click', (e) => {
              this.map.fitBounds(e.target.getBounds());
              this.addCityMarkers('Hong Kong');
            });
            this.countryLayers.addLayer(layer); // Ajout de la couche au LayerGroup
          }
        }).addTo(this.map);

        // Ajouter un marqueur à Hong Kong
        const hongKongLatLng = L.latLng(22.3193, 114.1694);  // Coordonnées de Hong Kong
        const marker = L.marker(hongKongLatLng).addTo(this.map);
        marker.bindPopup('<b>Hong Kong</b>');

        // Ajouter un événement de clic pour zoomer sur le marqueur
        marker.on('click', () => {
          this.map.setView(hongKongLatLng, 10);  // Zoomer à un niveau 10
          marker.openPopup();  // Ouvrir la popup du marqueur
        });
      },
      (error) => {
        console.error('Erreur lors du chargement des données GeoJSON de Hong Kong:', error);
      }
    );
  }

  private handleMapMoveEnd(): void {
    if (this.map.getZoom() >= 5) {
      this.countryLayers.eachLayer(layer => {
        if (layer instanceof L.GeoJSON) {
          const feature = layer.feature as any;
          if (feature && this.map.getBounds().intersects(layer.getBounds())) {
            this.addCityMarkers(feature.properties.ADMIN);
          }
        }
      });
    } else {
      this.clearCityMarkers();
    }
  }

  private addCityMarkers(country: string): void {
    const countryData = this.jsonData.find(c => c.country === country);
    if (countryData) {
      const cities = countryData.villes;
      for (const city in cities) {
        if (cities.hasOwnProperty(city)) {
          this.geocodingService.getCoordinates(city).subscribe(
            (data: any) => {
              if (data.length > 0) {
                const latLng = L.latLng(data[0].lat, data[0].lon);
                const marker = L.marker(latLng).addTo(this.map);
                marker.bindPopup(`<b>${city}</b>`);
                this.cityMarkers.push(marker);
              }
            },
            (error) => {
              console.error('Erreur lors du géocodage de la ville:', error);
            }
          );
        }
      }
    }
  }

  private clearCityMarkers(): void {
    this.cityMarkers.forEach(marker => this.map.removeLayer(marker));
    this.cityMarkers = [];
  }
}
