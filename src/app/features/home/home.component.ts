import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ImageBackgroundComponent } from '../../shared/components/image-background/image-background.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ImageBackgroundComponent, MatCardModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToMap() {
    this.router.navigate(['/map']);
  }

  navigateToCountryList() {
    this.router.navigate(['/country-list']);
  }
}
