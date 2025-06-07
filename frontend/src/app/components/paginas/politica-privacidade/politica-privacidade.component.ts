import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-politica-privacidade',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './politica-privacidade.component.html',
  styleUrl: './politica-privacidade.component.css'
})
export class PoliticaPrivacidadeComponent {

  ngOnInit() {
    window.scroll(0, 0);
  }
  
}
