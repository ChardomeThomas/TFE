import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JsonService } from '../../../core/service/jsonService/json.service';
import { Photo2 } from '../../../interface/country.interface'; // Assure-toi que Photo2 est bien défini
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ImageBackgroundComponent } from '../../../shared/components/image-background/image-background.component';
import { AuthService } from '../../../auth/auth.service';

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
  isUserLoggedIn: boolean = false;    // Etat de connexion de l'utilisateur
  
  constructor(
    private route: ActivatedRoute,
    private jsonService: JsonService,
    private router: Router,
    private authService: AuthService  // Injection du service AuthService
  ) {}

  ngOnInit() {
    // Vérifie si l'utilisateur est connecté
    this.isUserLoggedIn = this.authService.isLoggedIn();
    console.log('Utilisateur connecté au chargement :', this.isUserLoggedIn);
  
    // Récupérer l'ID du jour depuis l'URL
    this.route.paramMap.subscribe(params => {
      this.city = params.get('city')!;
      this.day = params.get('day')!;
      const dayId = parseInt(this.day.replace('Jour', ''), 10);
      this.loadPhotosForDay(dayId);
    });
  }

  loadPhotosForDay(dayId: number) {
    this.jsonService.getPhotos().subscribe((data: any) => {
      this.photos = data.photos.map((photo: any) => ({
        ...photo,
        isPrivate: photo.visibility === 'private', // Convertit visibility en boolean
        loaded: false, // Initialiser loaded si nécessaire
      })).filter((photo: Photo2) => 
        photo.id_day === dayId && (this.isUserLoggedIn || !photo.isPrivate)
      );
    
      console.log('Photos après conversion et filtrage :', this.photos);
    });
    
  }


  onPhotoClick(photo: Photo2): void {
    this.selectedPhoto = photo;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.router.navigate([this.router.url]);
  }
}
