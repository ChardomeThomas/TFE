import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-country-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './country-form.component.html',
  styleUrl: './country-form.component.css'
})
export class CountryFormComponent {
	value: string = '';
}
