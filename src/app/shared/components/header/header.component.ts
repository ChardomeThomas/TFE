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
  ngOnInit() {
    const url = new URL(window.location.href);
    if (url.searchParams.has('reload')) {
      url.searchParams.delete('reload');
      this.router.navigate([url.pathname], { queryParams: {} }); // Supprimer le paramètre de rechargement
    }
  }
  openForm(formType: string) {
    this.currentForm = formType; 
  }
  closeForm() {
    this.currentForm = ''; 
    window.location.href = window.location.href.split('?')[0] + '?reload=' + new Date().getTime();
  }
  
  
  
  onLogoClick() {
    this.router.navigate(['']);
  }

login(): void {
	this.authService.login(); 
	// this.router.navigate([]); // Ne pas changer de page
    window.location.href = window.location.href.split('?')[0] + '?reload=' + new Date().getTime();
  }
  
  logout(): void {
	this.authService.logout(); 
	// this.router.navigate([]); // Ne pas changer de page
  window.location.href = window.location.href.split('?')[0] + '?reload=' + new Date().getTime();
  }
  
// Vérifie si l'utilisateur est connecté
isLoggedIn(): boolean {
  return this.authService.isLoggedIn();  // Utilise le service pour vérifier la connexion
}
isOnCountryList(): boolean{
  return this.currentPage.includes('/country-list');
}
  // Vérifie si l'URL contient '/country/city' sans '/country-city'
  isOnCountryCityPage(): boolean {
    return this.currentPage.includes('/country-city') && !this.currentPage.includes('/day') && !this.currentPage.includes('/Jour');
  }

  isOnDayPage(): boolean {
    return /^\/[^\/]+\/[^\/]+$/.test(this.currentPage) && !this.currentPage.includes('/country-city');
  }
  isOnPhotoPage(): boolean {
    return this.currentPage.includes('/Jour');
  }

}
