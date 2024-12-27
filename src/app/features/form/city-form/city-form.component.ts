import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { City } from '../model/city.model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-city-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './city-form.component.html',
  styleUrls: ['./city-form.component.css']
})
export class CityFormComponent {
  cityForm: FormGroup;
  countries: any[] = [];  // Tableau pour stocker les pays
  countryId!: number;  // ID du pays récupéré depuis l'URL
  countryName!: string;  // Nom du pays récupéré depuis l'URL

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    // Initialisation du formulaire avec validation
    this.cityForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]), // Champ obligatoire et validation
    });

    // Récupérer le nom du pays depuis l'URL
    this.route.paramMap.subscribe(params => {
      this.countryName = params.get('country')!;  // Récupérer le nom du pays dans l'URL
      console.log('Nom du pays récupéré depuis l\'URL:', this.countryName);
      this.loadCountries();  // Charger les pays une fois le nom récupéré
    });
  }

  // Charge les pays depuis le fichier JSON
  loadCountries() {
    this.http.get<any>('https://thomas-chardome.be/ajout-json/countries.json').subscribe(
      (response) => {
        console.log('Réponse de la requête pour les pays:', response); // Ajoute ce log pour voir la réponse brute
        this.countries = response.countries || [];
        console.log('Pays chargés:', this.countries);
        
        // Trouver le pays correspondant dans le tableau en filtrant par nom
        const country = this.countries.find(c => c.name.toLowerCase() === this.countryName.toLowerCase());
        if (country) {
          this.countryId = country.countryId;  // Récupérer l'ID du pays
          console.log('ID du pays trouvé:', this.countryId);
        } else {
          console.error('Pays non trouvé. Vérifiez le nom dans l\'URL et les données du fichier JSON.');
        }
      },
      (error) => {
        console.error('Erreur lors du chargement des pays :', error);
      }
    );
  }

  // Envoie les données au backend pour ajouter une ville
  submit() {
    // Vérifier si le formulaire est valide et si l'ID du pays est récupéré
    if (this.cityForm.valid && this.countryId) {
      const city: City = {
        name: this.cityForm.value.name,
        countryId: this.countryId,  // Utilisation de l'ID du pays trouvé
      };
  
      // Vérification des données envoyées avant envoi
      console.log('Données envoyées :', city);
  
      // Ajout d'un log pour vérifier si l'ID du pays est bien défini avant l'envoi
      if (!this.countryId) {
        console.error('ID du pays introuvable. Vérifiez les données récupérées.');
        alert('ID du pays introuvable.');
        return;  // Empêche l'envoi de la requête si l'ID est invalide
      }
  
      // Envoi des données au backend pour ajouter la ville
      this.http.post('https://thomas-chardome.be/ajout-json/cities.php', city, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',  // Indique que les données sont en JSON
        })
      }).subscribe(
        (response) => {
          console.log('Ville ajoutée :', response);
          this.cityForm.reset();  // Réinitialise le formulaire après soumission
          alert('Ville ajoutée avec succès'); // Optionnel : ajouter un message de confirmation
        },
        (error) => {
          console.error('Erreur lors de l’ajout de la ville :', error);
          alert('Erreur lors de l\'ajout de la ville.'); // Optionnel : ajouter un message d'erreur
        }
      );
    } else {
      console.error('Le formulaire est invalide ou l\'ID du pays est introuvable.');
      alert('Formulaire invalide ou pays introuvable.'); // Optionnel : afficher un message d'erreur
    }
  }
  
}
