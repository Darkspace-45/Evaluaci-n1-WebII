import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../service/login.service';

interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm!: NgForm;
  
  activeTab: 'estudiante' | 'docente' = 'estudiante';
  showPassword: boolean = false;
  loginError: string = '';
  isLoading: boolean = false;
  
  loginData: LoginData = {
    email: '',
    password: '',
    rememberMe: false
  };

  // Datos del JSON para la autenticación
  usersData: any = null;

  constructor(
    private route: Router,
    private servicio: LoginService
  ) { }

  ngOnInit(): void {
    // Comprobar si ya hay un usuario logueado en localStorage
    if (localStorage.getItem('login') === 'true') {
      const userRole = localStorage.getItem('userRole');
      if (userRole) {
        this.redirectBasedOnRole(userRole);
      } else {
        // Si no hay rol especificado, redirigir a dashboard-docentes por defecto
        this.route.navigate(['dashboard-docentes']);
      }
    }

    // Cargar datos de usuarios desde la API
    this.loadUsers();
  }

  // Cargar usuarios disponibles desde la API
  loadUsers(): void {
    this.servicio.getLogin().subscribe({
      next: (data) => {
        console.log('Datos de login obtenidos:', data);
        this.usersData = data;
      },
      error: (err) => {
        console.error('Error al cargar usuarios disponibles', err);
      }
    });
  }

  setActiveTab(tab: 'estudiante' | 'docente'): void {
    this.activeTab = tab;
    this.loginError = ''; // Limpiar errores al cambiar de tab
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Método de login
  login(formulario: any) {
    // Validación básica del formulario
    if (formulario && formulario.invalid) {
      if (formulario.controls) {
        Object.keys(formulario.controls).forEach(key => {
          formulario.controls[key].markAsTouched();
        });
      }
      return;
    }

    this.isLoading = true;
    const loginValue = formulario && formulario.value ? formulario.value : this.loginData;

    // Verificar primero si el usuario existe en nuestros datos JSON
    if (this.usersData) {
      // Determinar qué colección usar según la pestaña activa
      const collection = this.activeTab === 'estudiante' ? this.usersData.estudiantes : this.usersData.docentes;
      
      // Buscar usuario con credenciales coincidentes
      const user = collection.find((u: any) => 
        u.email === loginValue.email && 
        u.password === loginValue.password
      );
      
      if (user) {
        // Si encontramos al usuario en los datos JSON, guardamos su rol
        localStorage.setItem('userRole', this.activeTab);
      }
    }

    // Llamar al servicio de login
    this.servicio.postLogin(loginValue).subscribe({
      next: (acceso) => {
        this.isLoading = false;
        console.log(acceso);
        
        if (acceso && acceso.accessToken) {
          let token = acceso.accessToken;
          if (token !== '') {
            localStorage.setItem('login', 'true');
            
            // Verificar el tipo de usuario para la redirección
            const userRole = localStorage.getItem('userRole');
            if (userRole) {
              this.redirectBasedOnRole(userRole);
            } else {
              // Si no se determinó el rol pero el login fue exitoso,
              // usar el rol de la pestaña activa para la redirección
              localStorage.setItem('userRole', this.activeTab);
              this.redirectBasedOnRole(this.activeTab);
            }
          }
        } else {
          this.loginError = 'Error de autenticación. Credenciales inválidas.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.loginError = 'Error de conexión. Por favor intenta más tarde.';
        console.error('Error al iniciar sesión', err);
      }
    });
  }

  // Redirigir según el rol
  private redirectBasedOnRole(role: string): void {
    if (role === 'estudiante') {
      this.route.navigate(['/dashboard-estudiantes']);
    } else if (role === 'docente') {
      this.route.navigate(['/dashboard-docentes']);
    }
  }
}