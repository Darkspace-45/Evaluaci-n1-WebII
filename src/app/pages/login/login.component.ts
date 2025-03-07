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

  usersData: any = null;

  constructor(
    private route: Router,
    private servicio: LoginService
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('login') === 'true') {
      const userRole = localStorage.getItem('userRole');
      if (userRole) {
        this.redirectBasedOnRole(userRole);
      } else {
        this.route.navigate(['privado']);
      }
    }

    this.loadUsers();
  }

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
    this.loginError = '';
    
    if (this.loginForm) {
      this.loginForm.resetForm(this.loginData);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  login(formulario: any) {
    if (formulario.invalid) {
      Object.keys(formulario.controls).forEach(key => {
        formulario.controls[key].markAsTouched();
      });
      return;
    }

    this.isLoading = true;

    if (this.usersData) {
      const collection = this.activeTab === 'estudiante' ? this.usersData.estudiantes : this.usersData.docentes;
      
      const user = collection.find((u: any) => 
        u.email === formulario.value.email && 
        u.password === formulario.value.password
      );
      
      if (user) {
        localStorage.setItem('userRole', this.activeTab);
      }
    }

    this.servicio.postLogin(formulario.value).subscribe({
      next: (acceso) => {
        this.isLoading = false;
        console.log(acceso);
        
        let token = acceso.accessToken;
        if (token != '') {
          localStorage.setItem('login', 'true');
          
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