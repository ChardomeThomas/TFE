import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from '../../../core/service/mapService/map.service';
import { JsonService } from '../../../core/service/jsonService/json.service';
import { FeatureCollection } from 'geojson';
import { Country, Jour } from '../../../interface/country.interface';
import { GeocodingService } from '../../../core/service/mapService/geoCoding.service';
import 'leaflet-sidebar-v2';
import { Router } from '@angular/router';

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
  private sidebar!: any; 
  private visitedCountries: Set<string> = new Set();
  private cityMarkers: L.Marker[] = [];  
  private countryLayers: L.LayerGroup = L.layerGroup(); 
  private jsonData: Country[] = []; 
  private hongKongMarker!: L.Marker; 

  constructor(
    private mapService: MapService,
    private jsonService: JsonService,
    private geocodingService: GeocodingService,
    private router : Router
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

    // Initialisation de la sidebar
    this.sidebar = (L.control as any).sidebar({
      container: 'sidebar',
      position: 'left'
    }).addTo(this.map);
  }

  private loadVisitedCountries(): void {
    this.jsonService.getJsonData().subscribe(
      (data: Country[]) => {
        this.jsonData = data;  
        data.forEach(country => this.visitedCountries.add(country.country));
        this.loadGeoJSON();
        this.loadHongKongData();  
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
                // Mettre à jour et ouvrir la sidebar
                this.updateSidebarContent(feature.properties.ADMIN);
                this.sidebar.open('home'); // 'home' doit correspondre à l'ID de l'onglet dans la sidebar
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
        if (!this.map.hasLayer(this.hongKongMarker)) {
          this.hongKongMarker.addTo(this.map);
        }
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
              this.hongKongMarker.remove();  // Retirer le marqueur de Hong Kong
              this.addCityMarkers('Hong Kong');
              // Mettre à jour et ouvrir la sidebar
              this.updateSidebarContent('Hong Kong');
              this.sidebar.open('home'); // 'home' doit correspondre à l'ID de l'onglet dans la sidebar
            });
            this.countryLayers.addLayer(layer); // Ajout de la couche au LayerGroup
          }
        }).addTo(this.map);

        // Ajouter un marqueur à Hong Kong
        const hongKongLatLng = L.latLng(22.3193, 114.1694);  // Coordonnées de Hong Kong
        this.hongKongMarker = L.marker(hongKongLatLng).addTo(this.map);
        this.hongKongMarker.bindPopup('<b>Hong Kong</b>');

        // Ajouter un événement de clic pour zoomer sur le marqueur
        this.hongKongMarker.on('click', () => {
          this.map.setView(hongKongLatLng, 10);  // Zoomer à un niveau 10
          this.hongKongMarker.openPopup();  // Ouvrir la popup du marqueur
          this.hongKongMarker.remove();  // Retirer le marqueur après le zoom
          this.addCityMarkers('Hong Kong');  // Ajouter les marqueurs des villes
          // Mettre à jour et ouvrir la sidebar
          this.updateSidebarContent('Hong Kong');
          this.sidebar.open('home'); // 'home' doit correspondre à l'ID de l'onglet dans la sidebar
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
      // Réafficher le marqueur de Hong Kong lors du dézoom
      if (!this.map.hasLayer(this.hongKongMarker)) {
        this.hongKongMarker.addTo(this.map);
      }
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
                const cityData = cities[city];
                const days = cityData.jours ? cityData.jours.map((j: Jour) => j.titre).join(', ') : 'No days available';
                marker.bindPopup(`<b>${city}</b><br>Days: ${days}`);
                marker.on('click', () => {
                  this.map.setView(latLng, 12);  // Zoomer sur la ville lorsqu'on clique sur le marqueur
                  this.updateSidebarContentForCity(country, city, cityData.jours);  // Mettre à jour la sidebar avec les jours
                  this.sidebar.open('home');  // Ouvrir la sidebar
                });
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
  private updateSidebarContentForCity(country: string, city: string, days: Jour[]): void {
    const sidebarContent = document.getElementById('sidebar-content');
    if (sidebarContent) {
      sidebarContent.innerHTML = `<h1>${city}</h1>`;
      if (days && days.length > 0) {
        days.forEach((day, index) => {
          sidebarContent.innerHTML += `<p class="day-link" data-day="${index}">${day.date}: ${day.titre}</p>`;
        });
  
        // Ajouter un événement de clic pour chaque jour
        const dayLinks = sidebarContent.getElementsByClassName('day-link');
        for (let i = 0; i < dayLinks.length; i++) {
          dayLinks[i].addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            const dayIndex = target.getAttribute('data-day');
            if (dayIndex !== null) {
              this.router.navigate([`${country}/${city}/Jour${parseInt(dayIndex) + 1}`]);
            }
          });
        }
      } else {
        sidebarContent.innerHTML += `<p>No days available</p>`;
      }
    }
  }
  
  

  
  private updateSidebarContent(country: string): void {
    const countryData = this.jsonData.find(c => c.country === country);
    if (countryData) {
      const sidebarContent = document.getElementById('sidebar-content');
      if (sidebarContent) {
        sidebarContent.innerHTML = `<h1>${country}</h1>`;
        const cities = countryData.villes;
        for (const city in cities) {
          if (cities.hasOwnProperty(city)) {
            sidebarContent.innerHTML += `<p class="city-link" data-city="${city}">${city}</p>`;
          }
        }
  
        // Ajouter un événement de clic pour chaque ville dans la sidebar
        const cityLinks = sidebarContent.getElementsByClassName('city-link');
        for (let i = 0; i < cityLinks.length; i++) {
          cityLinks[i].addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            const cityName = target.getAttribute('data-city');
            if (cityName) {
              const cityData = cities[cityName];
              this.updateSidebarContentForCity(country, cityName, cityData.jours);
            }
          });
        }
      }
    }
  }
  

  
}