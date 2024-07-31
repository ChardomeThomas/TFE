import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JsonService } from '../../../core/service/jsonService/json.service';
import { Country } from '../../../interface/country.interface';

@Component({
  selector: 'app-country-city',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './country-city.component.html',
  styleUrls: ['./country-city.component.css']
})
export class CountryCityComponent implements OnInit {
  country!: string;
  city!: string;
  countryData: Country | undefined;

  constructor(private route: ActivatedRoute, private jsonService: JsonService, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.country = params.get('country')!;
      this.city = params.get('city')!;
      this.loadCountryData();
    });
  }

  getCityNames(villes: { [key: string]: any }): string[] {
    return Object.keys(villes);
  }
  goBack() {
    this.router.navigate([`/country-list`]);
  }
  loadCountryData() {
    this.jsonService.getJsonData().subscribe(data => {
      this.countryData = data.find((country: Country) => country.country === this.country);
    });
  }
  onCountryCityClick(country: string, city: string) {
    this.router.navigate([`/${country}/${city}`]);
  }
}
