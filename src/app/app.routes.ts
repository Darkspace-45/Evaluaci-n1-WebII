import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { DashboardDocentesComponent } from './pages/dashboard-docentes/dashboard-docentes.component';
import { DashboardEstudiantesComponent } from './pages/dashboard-estudiantes/dashboard-estudiantes.component';
import { LoginComponent } from './pages/login/login.component';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
    {
        path: 'inicio',
        component: InicioComponent
    },
    {
        path: 'docentes',
        component: DashboardDocentesComponent, canActivate: [loginGuard]
    },
    {
        path: 'estudiantes',
        component: DashboardEstudiantesComponent, canActivate: [loginGuard]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
    }
];
