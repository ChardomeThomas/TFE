import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CityFormComponent } from '../../../features/form/city-form/city-form.component';
import { CountryFormComponent } from '../../../features/form/country-form/country-form.component';
import { DayFormComponent } from '../../../features/form/day-form/day-form.component';
import { PhotoFormComponent } from '../../../features/form/photo-form/photo-form.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, CityFormComponent, CountryFormComponent, DayFormComponent, PhotoFormComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  currentPage: string = '';
  currentForm: string = ''; 
  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.currentPage = this.router.url; 
      console.log(this.currentPage);
    });
  }
  openForm(formType: string) {
    this.currentForm = formType; 
  }
  closeForm() {
    this.currentForm = ''; 
  }
  
  
  
  onLogoClick() {
    this.router.navigate(['']);
  }
  login() {
    localStorage.setItem('isConnected', 'true');
  }
  
  logout() {
    localStorage.removeItem('isConnected');
  }
  
  isLoggedIn(): boolean {
    return localStorage.getItem('isConnected') === 'true';
  }
  // Vérifie si l'URL contient '/country/city' sans '/country-city'
  isOnCountryCityPage(): boolean {
    return this.currentPage.includes('/country-city') && !this.currentPage.includes('/day') && !this.currentPage.includes('/Jour');
  }

  // Vérifie si l'URL correspond à une page de jour, e.g. '/country/city/Jour1'
  isOnDayPage(): boolean {
    return /^\/[^\/]+\/[^\/]+$/.test(this.currentPage) && !this.currentPage.includes('/country-city');
  }
  // Vérifie si l'URL correspond à une page de photo, e.g. '/country/city/Jour1/photo'
  isOnPhotoPage(): boolean {
    return this.currentPage.includes('/Jour');
  }
}
