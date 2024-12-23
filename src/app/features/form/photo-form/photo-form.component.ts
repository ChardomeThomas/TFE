import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-photo-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './photo-form.component.html',
  styleUrl: './photo-form.component.css'
})
export class PhotoFormComponent {
	value: string = '';
}
