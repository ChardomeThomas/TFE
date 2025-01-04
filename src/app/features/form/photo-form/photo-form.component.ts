import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-photo-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './photo-form.component.html',
  styleUrls: ['./photo-form.component.css']
})
export class PhotoFormComponent {
  photoForm: FormGroup;
  dayId!: number;
  submitted: boolean = false;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.photoForm = new FormGroup({
      url: new FormControl('', [Validators.required, Validators.pattern('https?://.+')]),
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      visibility: new FormControl('public', [Validators.required])
    });

    // Récupérer le dernier paramètre de l'URL qui contient "JourX"
    this.route.paramMap.subscribe(params => {
      const lastParam = params.get('day');  // Récupère le dernier paramètre de l'URL
      if (lastParam) {
        const match = lastParam.match(/Jour(\d+)/);  // Cherche un match avec "JourX"
        if (match && match[1]) {
          this.dayId = parseInt(match[1], 10);  // Extrait le chiffre après "Jour"
        } else {
          console.error('ID de la journée non valide.');
        }
      } else {
        console.error('Aucun paramètre de journée trouvé dans l\'URL.');
      }
    });
  }

  submit() {
    if (this.photoForm.valid && this.dayId) {
      const photoData = {
        id_day: this.dayId,  
        title: this.photoForm.value.title,
        url: this.photoForm.value.url,
        description: this.photoForm.value.description,
        visibility: this.photoForm.value.visibility
      };
  
      console.log('Données envoyées :', photoData);  
  
      this.http.post('https://thomas-chardome.be/ajout-json/photos.php', photoData, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }).subscribe(
        (response) => {
          console.log('Photo ajoutée :', response);
          this.submitted = true;  
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de la photo :', error);
          alert(`Erreur : ${error.error.error}`);
        }
      );
    } else {
      if (!this.dayId) {
        console.error('L\'ID de la journée est manquant.');
        alert('L\'ID de la journée est manquant.');
      } else {
        alert('Formulaire invalide');
      }
    }
  }
  closeForm() {
    // window.location.reload();  
	this.router.navigate([this.router.url]);

  }
  
}
