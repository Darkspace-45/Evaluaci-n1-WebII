import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
  encapsulation: ViewEncapsulation.None
})
export class InicioComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit(): void {
    // Inicialización del componente
  }

  // Navegación programática
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  // Métodos para el formulario de contacto

  // Métodos para el formulario de contacto
  submitContactForm(event: Event): void {
    event.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    alert('Mensaje enviado. ¡Gracias por contactarnos!');
  }
}