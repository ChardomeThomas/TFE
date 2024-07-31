import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { JsonService } from '../../../core/service/jsonService/json.service';
import { Country, Jour } from '../../../interface/country.interface'; // Assurez-vous que le chemin est correct
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-city-day',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './city-day.component.html',
  styleUrls: ['./city-day.component.css']
})
export class CityDayComponent implements OnInit {
  country!: string;
  city!: string;
  cityData: Country | undefined;
  constructor(private route: ActivatedRoute, private jsonService: JsonService, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.country = params.get('country')!;
      this.city = params.get('city')!;
      this.loadCityData();
    });
  }

  loadCityData() {
    this.jsonService.getJsonData().subscribe((data: Country[]) => {
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
