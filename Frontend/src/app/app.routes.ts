import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './modules/home/login/login.component';
import { ProductosComponent } from './modules/productos/productos.component';
import { ContactComponent } from './modules/contact/contact.component';
import { ShoppingCartComponent  } from './modules/cart/cart.component';
import { AcercaComponent } from './modules/acerca/acerca.component';
import { FaqComponent } from './modules/faq/faq.component';
import { AdminComponent } from './modules/admin/admin.component';
import { UsersComponent } from './modules/admin/users/users.component';
import { ProductsComponent } from './modules/admin/products/products.component';
import { InvoicesComponent } from './modules/admin/invoices/invoices.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { path: 'invoices', component: InvoicesComponent },
  { path: 'adminproducts', component: ProductsComponent },
  { path: 'users', component: UsersComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'products', component: ProductosComponent },
  { path: 'acerca', component: AcercaComponent },
  { path: 'cart', component: ShoppingCartComponent  },
  { path: 'contact', component: ContactComponent },
  { path: 'home', component: HomeComponent }, // Página principal
  { path: '**', redirectTo: 'home' }, // Redirigir a login por defecto
  { path: '', component: HomeComponent },
];
