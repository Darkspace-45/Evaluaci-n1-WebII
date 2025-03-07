import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Course {
  id: number;
  name: string;
  teacher: string;
  schedule: string;
  grade: number;
  progress: number;
  imageUrl: string;
}

interface ActivityDate {
  day: string;
  month: string;
}

interface Activity {
  id: number;
  title: string;
  description: string;
  course: string;
  time: string;
  date: ActivityDate;
  type: 'exam' | 'assignment' | 'lecture';
}

@Component({
  selector: 'app-dashboard-estudiantes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-estudiantes.component.html',
  styleUrl: './dashboard-estudiantes.component.css',
  encapsulation: ViewEncapsulation.None
})
export class DashboardEstudiantesComponent implements OnInit {

  // Información del estudiante
  studentName: string = 'Carlos Rodríguez';

  // Estadísticas
  pendingAssignments: number = 5;
  upcomingExams: number = 2;

  // Control de vista
  viewMode: 'grid' | 'list' = 'grid';

  // Datos de cursos
  courses: Course[] = [];

  // Actividades próximas
  upcomingActivities: Activity[] = [];

  constructor(private route: Router) { }

  logout() {
    localStorage.setItem("login", "false");
    this.route.navigate(['login']);
  }

  ngOnInit(): void {
    this.loadCourses();
    this.loadActivities();
  }

  // Cargar cursos de ejemplo
  loadCourses(): void {
    this.courses = [
      {
        id: 1,
        name: 'Bases de Datos',
        teacher: 'Dr. Martín Sánchez',
        schedule: 'Lun, Mié, Vie - 10:00-12:00',
        grade: 87,
        progress: 65,
        imageUrl: 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' // Esta imagen deberá ser reemplazada por una real
      },
      {
        id: 2,
        name: 'Programación Orientada a Objetos',
        teacher: 'Dra. Ana González',
        schedule: 'Mar, Jue - 13:00-15:30',
        grade: 92,
        progress: 78,
        imageUrl: 'https://www.northware.mx/wp-content/uploads/2021/04/ejemplo-programacion-orientada-a-objetos.jpg'
      },
      {
        id: 3,
        name: 'Redes de Computadoras',
        teacher: 'Ing. Pablo López',
        schedule: 'Lun, Mié - 15:00-17:00',
        grade: 79,
        progress: 60,
        imageUrl: 'https://coltecno.com/wp-content/uploads/2024/08/tipos-redes-informaticas.jpg'
      },
      {
        id: 4,
        name: 'Desarrollo Web Frontend',
        teacher: 'Lic. Laura Torres',
        schedule: 'Mar, Jue - 08:00-10:30',
        grade: 95,
        progress: 85,
        imageUrl: 'https://kinsta.com/es/wp-content/uploads/sites/8/2021/12/front-end-developer.png'
      }
    ];
  }

  // Cargar actividades de ejemplo
  loadActivities(): void {
    this.upcomingActivities = [
      {
        id: 1,
        title: 'Examen Parcial',
        description: 'Examen sobre Modelo Relacional y SQL',
        course: 'Bases de Datos',
        time: '10:00 - 12:00',
        date: { day: '15', month: 'May' },
        type: 'exam'
      },
      {
        id: 2,
        title: 'Entrega de Proyecto',
        description: 'Implementación de sistema de gestión de inventario',
        course: 'Bases de Datos',
        time: '23:59',
        date: { day: '20', month: 'May' },
        type: 'assignment'
      },
      {
        id: 3,
        title: 'Clase Especial',
        description: 'Optimización de consultas SQL y uso de índices',
        course: 'Bases de Datos',
        time: '10:00 - 12:00',
        date: { day: '17', month: 'May' },
        type: 'lecture'
      }
    ];
  }

  // Calcular promedio de calificaciones
  getAverageGrade(): number {
    if (this.courses.length === 0) return 0;
    const sum = this.courses.reduce((total, course) => total + course.grade, 0);
    return sum / this.courses.length;
  }

  // Obtener iniciales para el avatar
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  // Clase CSS para la barra de progreso
  getProgressClass(progress: number): string {
    if (progress >= 75) return 'high';
    if (progress >= 50) return 'medium';
    return 'low';
  }

  // Icono para el tipo de actividad
  getActivityIcon(type: string): string {
    switch (type) {
      case 'exam': return 'fa-file-alt';
      case 'assignment': return 'fa-clipboard-list';
      case 'lecture': return 'fa-chalkboard-teacher';
      default: return 'fa-calendar-day';
    }
  }
}