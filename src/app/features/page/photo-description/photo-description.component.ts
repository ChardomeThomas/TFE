import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { JsonService } from '../../../core/service/jsonService/json.service';
import { Country, Jour } from '../../../interface/country.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-photo-description',
  templateUrl: './photo-description.component.html',
  imports: [CommonModule],
  standalone: true,
  styleUrls: ['./photo-description.component.css']
})
export class PhotoDescriptionComponent implements OnInit {
  country!: string;
  city!: string;
  day!: string;
  photoIndex!: number;
  photoUrl!: string;
  photoDescription!: string;

  constructor(private route: ActivatedRoute, private jsonService: JsonService, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.country = params.get('country')!;
      this.city = params.get('city')!;
      this.day = params.get('day')!;
      this.photoIndex = +params.get('photoIndex')!;
      this.loadPhotoData();
    });
  }

  refreshCountries() {
    // Ajouter ici la logique pour recharger les données ou mettre à jour la liste des pays
    console.log('Liste des pays mise à jour.');
  }
  goBack() {
    this.router.navigate([`/${this.country}/${this.city}/${this.day}`]);
  }
  loadPhotoData() {
    this.jsonService.getCountries().subscribe((data: Country[]) => {
      const countryData = data.find(country => country.country === this.country);
      if (countryData) {
        const cityData = countryData.villes[this.city];
        if (cityData) {
          const dayData = cityData.jours.find((jour: Jour) => `Jour${jour.jour}` === this.day);
          if (dayData && dayData.photos[this.photoIndex]) {
            this.photoUrl = dayData.photos[this.photoIndex].url;
            this.photoDescription = dayData.photos[this.photoIndex].description;
          }
        }
      }
    });
  }
}
