import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CityFormComponent } from '../../../features/form/city-form/city-form.component';
import { CountryFormComponent } from '../../../features/form/country-form/country-form.component';
import { DayFormComponent } from '../../../features/form/day-form/day-form.component';
import { PhotoFormComponent } from '../../../features/form/photo-form/photo-form.component';
import { AuthService } from '../../../auth/auth.service';

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
  constructor(private router: Router, private authService: AuthService) {
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
 // Méthode pour se connecter
//  login(): void {
//   this.authService.login(); // Utilise le service pour se connecter
//   window.location.reload(); // Rafraîchit la page
// }

// logout(): void {
//   this.authService.logout(); // Utilise le service pour se déconnecter
//   window.location.reload(); // Rafraîchit la page
// }

login(): void {
	this.authService.login(); // Simuler une connexion
	this.router.navigate([]); // Ne pas changer de page
  }
  
  logout(): void {
	this.authService.logout(); // Simuler une déconnexion
	this.router.navigate([]); // Ne pas changer de page
  }
  
// Vérifie si l'utilisateur est connecté
isLoggedIn(): boolean {
  return this.authService.isLoggedIn();  // Utilise le service pour vérifier la connexion
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
