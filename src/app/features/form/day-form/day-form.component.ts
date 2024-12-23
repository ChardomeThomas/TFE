import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-day-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './day-form.component.html',
  styleUrl: './day-form.component.css'
})
export class DayFormComponent {
	value: string = '';
}
