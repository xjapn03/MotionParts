import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './modules/home/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent }, // Página principal
  { path: '**', redirectTo: 'home' }, // Redirigir a login por defecto
  { path: '', component: HomeComponent },
];
