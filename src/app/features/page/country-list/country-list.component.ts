import { Component, OnInit } from '@angular/core';
import { JsonService } from '../../../core/service/jsonService/json.service';
import { CommonModule } from '@angular/common';
import { Country } from '../../../interface/country.interface';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CountryFormComponent } from '../../form/country-form/country-form.component';

@Component({
  selector: 'app-country-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, CountryFormComponent],
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.css']
})
export class CountryListComponent implements OnInit {
  jsonData: Country[] = [];
  isFormVisible = false; // Contrôle la visibilité de la fenêtre modale

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
  constructor(private jsonService: JsonService, private router: Router) { }

  ngOnInit() {
    this.jsonService.getJsonData().subscribe(
      data => {
        console.log('Data received:', data);
        this.jsonData = data;
        // this.processJsonData();
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
  }


  onCountryClick(country: string) {
    this.router.navigate([`/${country}/country-city`]);
  }
  goBack() {
    this.router.navigate([``]);
  }
  getKeys(obj: Country): string[] {
    return Object.keys(obj);
  }
}
