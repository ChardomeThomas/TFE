import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-country-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './country-form.component.html',
  styleUrls: ['./country-form.component.css']
})
export class CountryFormComponent {
  countryForm: FormGroup;

  constructor(private http: HttpClient) {
    this.countryForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      flag: new FormControl('', [Validators.required, Validators.pattern('https?://.+')]) // Champ pour l'URL du drapeau
    });
  }

  submit() {
    if (this.countryForm.valid) {
      const url = 'https://thomas-chardome.be/ajout-json/countries.php';
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

      this.http.post(url, this.countryForm.value, { headers }).subscribe({
        next: (response) => console.log('Pays ajouté :', response),
        error: (err) => console.error('Erreur lors de l’ajout :', err)
      });

      this.countryForm.reset(); // Réinitialise le formulaire après soumission
    } else {
      console.error('Le formulaire est invalide.');
    }
  }
}
