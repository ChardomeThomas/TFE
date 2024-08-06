import { Component, OnInit } from '@angular/core';
import { JsonService } from '../../../core/service/jsonService/json.service';
import { CommonModule } from '@angular/common';
import { Country } from '../../../interface/country.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-country-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.css']
})
export class CountryListComponent implements OnInit {
  jsonData: Country[] = [];

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
