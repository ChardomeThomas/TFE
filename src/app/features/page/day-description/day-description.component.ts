import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JsonService } from '../../../core/service/jsonService/json.service';
import { Country, Jour } from '../../../interface/country.interface';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ImageBackgroundComponent } from '../../../shared/components/image-background/image-background.component';

@Component({
  selector: 'app-day-description',
  templateUrl: './day-description.component.html',
  imports: [CommonModule, NgxSkeletonLoaderModule, ImageBackgroundComponent],
  standalone: true,
  styleUrls: ['./day-description.component.css']
})
export class DayDescriptionComponent implements OnInit {
  country!: string;
  city!: string;
  day!: string;
  dayData: Jour | undefined;

  constructor(private route: ActivatedRoute, private jsonService: JsonService, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.country = params.get('country')!;
      this.city = params.get('city')!;
      this.day = params.get('day')!;
      this.loadDayData();
    });
  }
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
  loadDayData() {
    this.jsonService.getCountries().subscribe((data: Country[]) => {
      const countryData = data.find(country => country.country === this.country);
      if (countryData) {
        const cityData = countryData.villes[this.city];
        if (cityData) {
          this.dayData = cityData.jours.find((jour: Jour) => `Jour${jour.jour}` === this.day);
          
          // Initialiser la propriété 'loaded' pour chaque photo
          if (this.dayData?.photos) {
            this.dayData.photos.forEach(photo => {
              (photo as any).loaded = false; // Ajouter la propriété 'loaded'
            });
          }
  
          console.log('Day data:', this.dayData);
        }
      }
    });
  }
  goBack() {
    this.router.navigate([`/${this.country}/${this.city}`]);
  }
  onPhotoClick(photoIndex: number) {
    this.router.navigate([`/${this.country}/${this.city}/${this.day}/photos/${photoIndex}`]);
  }
}
