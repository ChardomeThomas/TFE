import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-image-background',
  standalone: true,
  imports: [HeaderComponent, BreadcrumbComponent],
  templateUrl: './image-background.component.html',
  styleUrl: './image-background.component.css'
})
export class ImageBackgroundComponent {

}
