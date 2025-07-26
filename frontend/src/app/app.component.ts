import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Gym Track';
  
  constructor(private meta: Meta) {}
  
  ngOnInit() {
    // Configurar metadatos para mejorar SEO
    this.meta.addTags([
      { name: 'description', content: 'Aplicación para seguimiento de entrenamientos y progreso físico' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#3182ce' }
    ]);
  }
}
