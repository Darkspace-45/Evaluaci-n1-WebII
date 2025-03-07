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
        this.route.navigate(['privado']);
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
    
    // Resetear la validación del formulario cuando cambie el tab
    if (this.loginForm) {
      this.loginForm.resetForm(this.loginData);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Método de login que solicitaste
  login(formulario: any) {
    // Validación básica del formulario
    if (formulario.invalid) {
      Object.keys(formulario.controls).forEach(key => {
        formulario.controls[key].markAsTouched();
      });
      return;
    }

    this.isLoading = true;

    // Verificar primero si el usuario existe en nuestros datos JSON
    if (this.usersData) {
      // Determinar qué colección usar según la pestaña activa
      const collection = this.activeTab === 'estudiante' ? this.usersData.estudiantes : this.usersData.docentes;
      
      // Buscar usuario con credenciales coincidentes
      const user = collection.find((u: any) => 
        u.email === formulario.value.email && 
        u.password === formulario.value.password
      );
      
      if (user) {
        // Si encontramos al usuario en los datos JSON, guardamos su rol
        localStorage.setItem('userRole', this.activeTab);
      }
    }

    // Llamar al servicio de login como solicitaste
    this.servicio.postLogin(formulario.value).subscribe({
      next: (acceso) => {
        this.isLoading = false;
        console.log(acceso);
        
        let token = acceso.accessToken;
        if (token != '') {
          localStorage.setItem('login', 'true');
          
          // Verificar el tipo de usuario para la redirección
          const userRole = localStorage.getItem('userRole');
          if (userRole) {
            this.redirectBasedOnRole(userRole);
          } else {
            this.route.navigate(['privado']);
          }
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.loginError = 'Error de conexión. Por favor intenta más tarde.';
        console.error('Error al iniciar sesión', err);
      }
    });
  }

  // Autollenar credenciales para demo
  fillDemoCredentials(): void {
    if (!this.usersData) return;
    
    const collection = this.activeTab === 'estudiante' ? this.usersData.estudiantes : this.usersData.docentes;
    
    if (collection && collection.length > 0) {
      const user = collection[0];
      this.loginData.email = user.email;
      this.loginData.password = user.password;
      
      // Resetear validaciones después de rellenar
      if (this.loginForm) {
        this.loginForm.form.markAsPristine();
        this.loginForm.form.markAsUntouched();
      }
    }
  }

  // Redirigir según el rol
  private redirectBasedOnRole(role: string): void {
    if (role === 'estudiante') {
      this.route.navigate(['/estudiantes']);
    } else if (role === 'docente') {
      this.route.navigate(['/docentes']);
    } else {
      this.route.navigate(['privado']);
    }
  }
}