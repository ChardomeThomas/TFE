import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JsonService } from '../../../core/service/jsonService/json.service';
import { Country2 } from '../../../interface/country.interface';
import { ImageBackgroundComponent } from '../../../shared/components/image-background/image-background.component';

@Component({
  selector: 'app-country-city',
  standalone: true,
  imports: [CommonModule, ImageBackgroundComponent],
  templateUrl: './country-city.component.html',
  styleUrls: ['./country-city.component.css']
})
export class CountryCityComponent implements OnInit {
  country!: string;
  city!: string;
  countryData: Country2 | undefined;
  cities: any[] = [];  // Tableau pour stocker les villes du pays sélectionné
  allCities: any[] = [];  // Tableau pour stocker toutes les villes (utilisé pour le filtrage)

  constructor(
    private route: ActivatedRoute,
    private jsonService: JsonService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.country = params.get('country')!;
      this.city = params.get('city')!;
      this.loadCountryData();
    });
  }

  loadCountryData() {
    // Charger les pays
    this.jsonService.getCountries().subscribe(
      (response: any) => {
        const countries = response.countries;  // Accédez à la clé "countries"
        if (Array.isArray(countries)) {
          // Utilisez find() pour trouver le pays correspondant au nom
          this.countryData = countries.find(country => country.name === this.country);
        } else {
          console.error('La réponse des pays n\'est pas un tableau');
        }
  
        // Une fois que countryData est défini, charger et filtrer les villes
        if (this.countryData) {
          this.jsonService.getCities().subscribe(
            (response: any) => {
              console.log('Réponse des villes:', response);  // Log de la réponse
              // Accéder directement à la clé 'cities' qui contient le tableau
              const cities = response.cities;
              
              // Vérifier si 'cities' est bien un tableau
              if (Array.isArray(cities)) {
                this.allCities = cities;  // Assigner directement le tableau de villes
                this.filterCitiesByCountryId();
              } else {
                console.error('Les villes ne sont pas sous forme de tableau', cities);
              }
            },
            (error) => {
              console.error('Erreur lors du chargement des villes:', error);
            }
          );
        } else {
          console.error('Le pays sélectionné n\'a pas été trouvé.');
        }
      },
      (error) => {
        console.error('Erreur lors du chargement des pays:', error);
      }
    );
  }
  
  

  filterCitiesByCountryId() {
    if (this.countryData) {
      this.cities = this.allCities.filter(city => city.countryId === this.countryData?.countryId);
    } else {
      console.error('countryData est indéfini');
    }
  }

  isFormVisible = false;
  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
  }

  onFormSubmitted(isSuccessful: boolean) {
    if (isSuccessful) {
      this.isFormVisible = false;
      this.refreshCountries();
    }
  }

  refreshCountries() {
    console.log('Liste des pays mise à jour.');
  }

  getCityNames(villes: { [key: string]: any }): string[] {
    return Object.keys(villes);
  }

  goBack() {
    this.router.navigate([`/country-list`]);
  }

  onCountryCityClick(country: string, city: string) {
    this.router.navigate([`/${country}/${city}`]);
  }
}
