import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: { label: string; url: string }[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.updateBreadcrumbs();  // Appel initial de updateBreadcrumbs
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateBreadcrumbs();
      }
    });
  }

private updateBreadcrumbs() {
  // Décomposer l'URL en segments
  const segments = this.router.url.split('/').filter((segment) => segment);

  // Ajouter le segment 'home' au début des breadcrumbs
  const homeBreadcrumb = { label: 'Home', url: '/' };

  // Si le chemin inclut `country-city` ou ses sous-segments
  if (segments.includes('country-city')) {
    // Ajout explicite de `country-list` au breadcrumb
    this.breadcrumbs = [homeBreadcrumb, { label: 'Country List', url: '/country-list' }];
  } else {
    // Créer les breadcrumbs de manière classique
    this.breadcrumbs = [homeBreadcrumb];
  }

  // Ajouter les autres segments progressivement
  this.breadcrumbs = this.breadcrumbs.concat(
    segments.map((segment, index) => {
      const url = '/' + segments.slice(0, index + 1).join('/');
      return { label: segment, url };
    })
  );

  console.log('Breadcrumbs:', this.breadcrumbs); // Vérification des données
}

  navigateTo(url: string) {
    this.router.navigateByUrl(url);
  }
}
