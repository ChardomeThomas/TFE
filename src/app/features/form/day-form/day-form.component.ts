import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-day-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './day-form.component.html',
  styleUrls: ['./day-form.component.css']
})
export class DayFormComponent {
  dayForm: FormGroup;
  cities: any[] = [];
  cityId!: number;
  cityName!: string;
  submitted: boolean = false; // Variable pour savoir si le formulaire a été soumis

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.dayForm = new FormGroup({
      day_number: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      description: new FormControl('', [Validators.required])
    });

    // Récupérer la ville depuis l'URL
    this.route.paramMap.subscribe(params => {
      this.cityName = params.get('city')!;
      this.loadCities();
    });
  }

  loadCities() {
    this.http.get<any>('https://thomas-chardome.be/ajout-json/cities.json').subscribe(
      (response) => {
        this.cities = response.cities || [];
        const city = this.cities.find(c => c.name.toLowerCase() === this.cityName.toLowerCase());
        if (city) {
          this.cityId = city.cityId;
        } else {
          console.error('Ville non trouvée.');
        }
      },
      (error) => {
        console.error('Erreur lors du chargement des villes :', error);
      }
    );
  }

  submit() {
    if (this.dayForm.valid) {
      const dayData = {
        day_number: this.dayForm.value.day_number,
        description: this.dayForm.value.description,
        id_city: this.cityId
      };

      this.http.post('https://thomas-chardome.be/ajout-json/days.php', dayData, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }).subscribe(
        (response) => {
          console.log('Journée ajoutée :', response);
          this.submitted = true; // Le formulaire a été soumis avec succès
          setTimeout(() => {
            window.location.reload(); // Actualise la page après un délai pour laisser le temps à l'utilisateur de voir le message
          }, 1000);
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de la journée :', error);
          alert(`Erreur lors de l'ajout de la journée. ${error.message}`);
        }
      );
    } else {
      alert('Formulaire invalide');
    }
  }
}