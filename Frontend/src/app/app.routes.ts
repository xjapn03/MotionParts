import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './modules/home/login/login.component';
import { ProductosComponent } from './modules/productos/productos.component';
import { ContactComponent } from './modules/contact/contact.component';
import { CartComponent } from './modules/cart/cart.component';
import { AcercaComponent } from './modules/acerca/acerca.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'products', component: ProductosComponent },
  { path: 'acerca', component: AcercaComponent },
  { path: 'cart', component: CartComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'home', component: HomeComponent }, // Página principal
  { path: '**', redirectTo: 'home' }, // Redirigir a login por defecto
  { path: '', component: HomeComponent },
];
