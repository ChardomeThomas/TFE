import { Component, OnInit } from '@angular/core';
import { JsonService } from '../../../core/service/jsonService/json.service';
import { CommonModule } from '@angular/common';
import { Country2 } from '../../../interface/country.interface';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ImageBackgroundComponent } from "../../../shared/components/image-background/image-background.component";
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-country-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, ImageBackgroundComponent, MatCardModule, MatButtonModule],
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.css']
})
export class CountryListComponent implements OnInit {
  jsonData: Country2[] = [];
  isFormVisible = false; // Contrôle la visibilité de la fenêtre modale

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
  }

  onFormSubmitted(isSuccessful: boolean) {
    if (isSuccessful) {
      this.isFormVisible = false; // Cache le formulaire après validation
      // Rafraîchir la liste ou mettre à jour l'affichage si nécessaire
    }
  }


  constructor(private jsonService: JsonService, private router: Router) { }

  ngOnInit() {
    this.jsonService.getCountries().subscribe(
      data => {
        console.log('Data received:', data);
        this.jsonData = data.countries;
        // this.processJsonData();
        console.log('jsonData:', this.jsonData);
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
  getKeys(obj: Country2): string[] {
    return Object.keys(obj);
  }
}
