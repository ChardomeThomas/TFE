import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent {
  breadcrumbs: { label: string; url: string }[] = [];

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateBreadcrumbs();
      }
    });
  }

  private updateBreadcrumbs() {
    const segments = this.router.url.split('/').filter((segment) => segment);
    this.breadcrumbs = segments.map((segment, index) => {
      const url = '/' + segments.slice(0, index + 1).join('/');
      return { label: segment, url };
    });
  }

  navigateTo(url: string) {
    this.router.navigateByUrl(url);
  }
}
