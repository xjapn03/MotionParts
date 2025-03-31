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
import { CategoriesComponent } from './modules/admin/categories/categories.component';
import { OrdersComponent } from './modules/admin/orders/orders.component';
import { InvoicesComponent } from './modules/admin/invoices/invoices.component';
import { SalesComponent } from './modules/admin/sales/sales.component';
import { CheckoutComponent } from './modules/checkout/checkout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { MyOrdersComponent } from './modules/orders/my-orders/my-orders.component';
import { OrderDetailsComponent } from './modules/orders/order-details/order-details.component';
import { ProfileComponent } from './modules/user/profile/profile.component';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard], // 🔐 Protección con el guard
    children: [
      { path: 'users', component: UsersComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'invoices', component: InvoicesComponent },
      { path: 'sales', component: SalesComponent }
    ]
  },

  { path: 'invoices', component: InvoicesComponent },
  { path: 'adminproducts', component: ProductsComponent },
  { path: 'users', component: UsersComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'products', component: ProductosComponent },
  { path: 'acerca', component: AcercaComponent },
  { path: 'cart', component: ShoppingCartComponent },
  { path: 'checkout', component: CheckoutComponent }, // ✅ Agregada la ruta de checkout
  { path: 'profile', component: ProfileComponent },
  { path: 'my-orders', component: MyOrdersComponent, canActivate: [AuthGuard] },
  { path: 'my-orders/:id', component: OrderDetailsComponent, canActivate: [AuthGuard] },
  { path: 'contact', component: ContactComponent },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: 'home' },
  { path: '', component: HomeComponent }
];
