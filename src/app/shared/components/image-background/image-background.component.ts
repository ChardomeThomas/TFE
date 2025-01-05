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

}
