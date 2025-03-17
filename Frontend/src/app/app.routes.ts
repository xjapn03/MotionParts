import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './modules/home/login/login.component';
import { ProductosComponent } from './modules/productos/productos.component';
import { ContactComponent } from './modules/contact/contact.component';
import { CartComponent } from './modules/cart/cart.component';
<<<<<<< HEAD
import { AcercaComponent } from './modules/acerca/acerca.component';
=======
import { FaqComponent } from './modules/faq/faq.component';
>>>>>>> fb3a9fd441219d1f65518993cc39d14f6dfc9021

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'products', component: ProductosComponent },
  { path: 'acerca', component: AcercaComponent },
  { path: 'cart', component: CartComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'home', component: HomeComponent }, // Página principal
  { path: '**', redirectTo: 'home' }, // Redirigir a login por defecto
  { path: '', component: HomeComponent },
];
