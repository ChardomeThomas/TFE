import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { JsonService } from '../../../core/service/jsonService/json.service';
import { Country, Jour } from '../../../interface/country.interface'; // Assurez-vous que le chemin est correct
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { CityFormComponent } from '../../form/city-form/city-form.component'; // Vérifiez le chemin exact
import { ImageBackgroundComponent } from '../../../shared/components/image-background/image-background.component';

@Component({
  selector: 'app-city-day',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatToolbar, MatButton, CityFormComponent, ImageBackgroundComponent],
  templateUrl: './city-day.component.html',
  styleUrls: ['./city-day.component.css']
})
export class CityDayComponent implements OnInit {
  country!: string;
  city!: string;
  cityData: Country | undefined;
  isFormVisible = false; // Contrôle la visibilité de la fenêtre modale
  constructor(private route: ActivatedRoute, private jsonService: JsonService, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.country = params.get('country')!;
      this.city = params.get('city')!;
      this.loadCityData();
    });
  }

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
  }

  onFormSubmitted(isSuccessful: boolean) {
    if (isSuccessful) {
      this.isFormVisible = false; // Cache le formulaire après validation
      // Rafraîchir la liste ou mettre à jour l'affichage si nécessaire
      this.refreshCountries();
    }
  }

  refreshCountries() {
    // Ajouter ici la logique pour recharger les données ou mettre à jour la liste des pays
    console.log('Liste des pays mise à jour.');
  }
  loadCityData() {
    this.jsonService.getCountries().subscribe((data: Country[]) => {
      const countryData = data.find(country => country.country === this.country);
      if (countryData) {
        this.cityData = countryData.villes[this.city];
        if (!this.cityData) {
          // Si cityData est undefined, redirigez vers la page d'accueil
          this.router.navigate(['/home']);
        }
      } else {
        // Si countryData est undefined, redirigez vers la page d'accueil
        this.router.navigate(['/home']);
      }
    });
  }

  goBack() {
    this.router.navigate([`/${this.country}/country-city`]);
  }
  onDayClick(country: string, city: string, day: number) {
    this.router.navigate([`/${country}/${city}/Jour${day}`]);
  }
}
