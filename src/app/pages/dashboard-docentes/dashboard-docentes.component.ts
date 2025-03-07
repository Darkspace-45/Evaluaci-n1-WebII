import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Student {
  id: number;
  name: string;
  email: string;
  course: string;
  grade: number;
  status: 'Aprobado' | 'Reprobado' | 'Supletorio';
}

@Component({
  selector: 'app-dashboard-docentes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-docentes.component.html',
  styleUrl: './dashboard-docentes.component.css',
  encapsulation: ViewEncapsulation.None
})
export class DashboardDocentesComponent implements OnInit {
  // Datos de ejemplo
  students: Student[] = [];
  filteredStudents: Student[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalPages: number = 1;

  // Variables para ordenamiento
  sortColumn: string = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private route: Router) { }

  logout() {
    localStorage.setItem("login", "false");
    this.route.navigate(['login']);
  }

  ngOnInit(): void {
    // Inicializar datos de estudiantes de prueba
    this.generateStudentData();
    this.filteredStudents = [...this.students];
    this.updatePagination();
  }

  // Generar datos de ejemplo para la demostración
  generateStudentData(): void {
    const courses = ['Base de Datos', 'Redes de Computadoras', 'Química', 'Historia', 'Literatura', 'Biología'];
    const statuses: ('Aprobado' | 'Reprobado' | 'Supletorio')[] = ['Aprobado', 'Reprobado', 'Supletorio'];

    for (let i = 1; i <= 50; i++) {
      const firstName = this.getRandomName('first');
      const lastName = this.getRandomName('last');
      const course = courses[Math.floor(Math.random() * courses.length)];

      this.students.push({
        id: i,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@ejemplo.edu`,
        course: course,
        grade: Math.floor(Math.random() * 101),
        status: statuses[Math.floor(Math.random() * statuses.length)]
      });
    }
  }

  // Nombres aleatorios para los datos de ejemplo
  getRandomName(type: 'first' | 'last'): string {
    const firstNames = ['María', 'Juan', 'Ana', 'Carlos', 'Laura', 'Pedro', 'Sofia', 'Miguel', 'Lucía', 'Diego', 'Valentina', 'Andrés'];
    const lastNames = ['García', 'Rodríguez', 'López', 'Martínez', 'González', 'Sánchez', 'Pérez', 'Fernández', 'Torres', 'Ramírez'];

    return type === 'first'
      ? firstNames[Math.floor(Math.random() * firstNames.length)]
      : lastNames[Math.floor(Math.random() * lastNames.length)];
  }

  // Filtrar estudiantes según el término de búsqueda
  filterStudents(): void {
    if (!this.searchTerm.trim()) {
      this.filteredStudents = [...this.students];
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredStudents = this.students.filter(student =>
        student.name.toLowerCase().includes(term) ||
        student.email.toLowerCase().includes(term) ||
        student.course.toLowerCase().includes(term) ||
        student.id.toString().includes(term)
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  // Ordenar datos de la tabla
  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredStudents.sort((a: any, b: any) => {
      const valueA = a[column];
      const valueB = b[column];

      if (typeof valueA === 'string') {
        return this.sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        return this.sortDirection === 'asc'
          ? valueA - valueB
          : valueB - valueA;
      }
    });
  }

  // Obtener icono para indicar dirección de ordenamiento
  getSortIcon(column: string): string {
    if (this.sortColumn !== column) {
      return 'fa-sort';
    }
    return this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }

  // Paginación
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredStudents.length / this.itemsPerPage);
  }

  // Obtener iniciales para avatar
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  // Generar color de fondo para avatar basado en el nombre
  getAvatarColor(name: string): string {
    const colors = [
      '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
      '#ec4899', '#f43f5e', '#ef4444', '#f59e0b', '#10b981'
    ];

    // Usar la suma de los códigos ASCII de los caracteres para determinar el color
    const charCodeSum = name
      .split('')
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);

    return colors[charCodeSum % colors.length];
  }

  // Estilo para la barra de calificación
  getGradeClass(grade: number): string {
    if (grade >= 80) return 'high';
    if (grade >= 60) return 'medium';
    return 'low';
  }

  // Estilo para el badge de estatus
  getStatusClass(status: string): string {
    switch (status) {
      case 'Activo': return 'active';
      case 'Inactivo': return 'inactive';
      case 'Pendiente': return 'pending';
      default: return '';
    }
  }

  // Estadísticas para las tarjetas
  getAverageGrade(): number {
    return this.students.reduce((sum, student) => sum + student.grade, 0) / this.students.length;
  }

  getPassingCount(): number {
    return this.students.filter(student => student.grade >= 70).length;
  }

  getFailingCount(): number {
    return this.students.filter(student => student.grade < 70).length;
  }
}