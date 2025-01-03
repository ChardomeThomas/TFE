import { Component, HostListener } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-background',
  standalone: true,
  imports: [HeaderComponent, BreadcrumbComponent, CommonModule],
  templateUrl: './image-background.component.html',
  styleUrl: './image-background.component.css'
})
export class ImageBackgroundComponent {
  isUnsupportedFormat = false;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.checkScreenSize(); // Vérifie au chargement
  }
  private checkScreenSize() {
    this.isUnsupportedFormat = window.innerWidth <= 400; // Définis ici ta limite
  }
}
