import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JsonService } from '../../../core/service/jsonService/json.service';
import { Photo2 } from '../../../interface/country.interface'; // Assure-toi que Photo2 est bien défini
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ImageBackgroundComponent } from '../../../shared/components/image-background/image-background.component';

@Component({
  selector: 'app-day-description',
  templateUrl: './day-description.component.html',
  imports: [CommonModule, NgxSkeletonLoaderModule, ImageBackgroundComponent],
  standalone: true,
  styleUrls: ['./day-description.component.css']
})
export class DayDescriptionComponent implements OnInit {
  city!: string;               // Ville récupérée de l'URL
  day!: string;                // Jour récupéré de l'URL
  photos: Photo2[] = [];       // Tableau pour stocker les photos de la journée sélectionnée
  selectedPhoto: Photo2 | null = null;  // Photo sélectionnée à afficher dans le modal
  isModalOpen: boolean = false;        // Contrôle l'état du modal

  constructor(
    private route: ActivatedRoute,
    private jsonService: JsonService,
    private router: Router
  ) {}

  ngOnInit() {
    // Récupérer l'ID du jour depuis l'URL
    this.route.paramMap.subscribe(params => {
      this.city = params.get('city')!;
      this.day = params.get('day')!; // Cela récupère "Jour1", "Jour2", etc.

      // Extraire l'ID du jour depuis le nom du jour dans l'URL (par exemple, "Jour1" -> 1)
      const dayId = parseInt(this.day.replace('Jour', ''), 10);
      
      // Charger les photos pour ce jour
      this.loadPhotosForDay(dayId);
    });
  }

  loadPhotosForDay(dayId: number) {
    this.jsonService.getPhotos().subscribe((data: any) => {
      // Filtrer les photos correspondant à l'ID du jour
      this.photos = data.photos.filter((photo: Photo2) => photo.id_day === dayId);
      console.log('Photos:', this.photos);  // Affiche les photos dans la console
    });
  }

  // Méthode pour ouvrir le modal avec la photo sélectionnée
  onPhotoClick(photo: Photo2): void {
    this.selectedPhoto = photo;
    this.isModalOpen = true;  // Ouvre le modal
  }
  closeModal() {
    this.isModalOpen = false;
    this.router.navigate([this.router.url]);  // Redirige vers la même page, ce qui déclenche un rechargement du composant
  }
  
  
  
}
