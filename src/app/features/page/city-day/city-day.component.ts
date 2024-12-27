import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JsonService } from '../../../core/service/jsonService/json.service';
import { Jour2 } from '../../../interface/country.interface'; // Utilise uniquement Jour2 pour les journées
import { ImageBackgroundComponent } from '../../../shared/components/image-background/image-background.component';

@Component({
  selector: 'app-city-day',
  standalone: true,
  imports: [CommonModule, ImageBackgroundComponent],
  templateUrl: './city-day.component.html',
  styleUrls: ['./city-day.component.css'],
})
export class CityDayComponent implements OnInit {
  city!: string;           // Ville récupérée de l'URL
  days: Jour2[] = [];      // Tableau pour stocker les journées de la ville sélectionnée
  allDays: Jour2[] = [];   // Tableau pour stocker toutes les journées (utilisé pour le filtrage)
  cities: any[] = [];      // Tableau pour stocker les données des villes

  constructor(
    private route: ActivatedRoute,
    private jsonService: JsonService,
    private router: Router
  ) {}

  ngOnInit() {
    // Récupère les paramètres de l'URL (ville uniquement)
    this.route.paramMap.subscribe((params) => {
      this.city = params.get('city')!;  // Récupère la ville à partir des paramètres de l'URL
      this.loadCityDays();              // Charge les journées pour la ville spécifiée
    });
  }

  loadCityDays() {
    // Charger les villes depuis le service
    this.jsonService.getCities().subscribe(
      (response: any) => {
        this.cities = response.cities; // Accède à la clé "cities" qui contient le tableau des villes
        this.loadAllDays();            // Charge toutes les journées après avoir récupéré les villes
      },
      (error) => {
        console.error('Erreur lors du chargement des villes:', error);
      }
    );
  }

  loadAllDays() {
    // Charger toutes les journées depuis le service
    this.jsonService.getDays().subscribe(
      (response: any) => {
        const allDays = response.days;  // Accède à la clé "days" qui contient le tableau des journées

        // Vérifie si 'allDays' est bien un tableau
        if (Array.isArray(allDays)) {
          this.allDays = allDays;  // Assigne directement le tableau de journées
          this.filterDaysByCity(); // Filtre les journées en fonction de la ville
        } else {
          console.error("Les journées ne sont pas sous forme de tableau", allDays);
        }
      },
      (error) => {
        console.error('Erreur lors du chargement des journées:', error);
      }
    );
  }

  filterDaysByCity() {
    // Obtenir l'ID de la ville à partir de son nom
    const cityId = this.getCityId(this.city);

    if (cityId !== -1) {
      // Filtrer les journées en fonction de l'ID de la ville
      this.days = this.allDays
        .filter((day) => day.id_city === cityId) // Filtrer par ville
        .sort((a, b) => a.day_number - b.day_number); // Trier par numéro de jour
    } else {
      console.error("Ville non trouvée.");
    }
  }

  getCityId(cityName: string): number {
    // Cherche l'ID de la ville dans le tableau des villes
    const city = this.cities.find((city) => city.name.toLowerCase() === cityName.toLowerCase());
    return city ? city.cityId : -1; // Retourne l'ID de la ville ou -1 si non trouvée
  }

  // Méthode pour afficher la page des détails d'un jour
  onCityDayClick(dayId: number) {
    this.router.navigate([`/city-day/${this.city}/Jour${dayId}`]);
  }

  goBack() {
    this.router.navigate([`/cities`]);  // Retour à la liste des villes ou autre page
  }
}
