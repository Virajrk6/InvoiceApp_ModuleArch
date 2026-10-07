import { Routes } from '@angular/router';
import { AuthGuard } from './services/authGurad/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'customer',
        canActivate: [AuthGuard],
        loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule)
    },
    {
        path: 'product',
        canActivate: [AuthGuard],
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule)
    },
    {
        path: 'invoice',
        canActivate: [AuthGuard],
        loadChildren: () => import('./invoice/invoice.module').then(m => m.InvoiceModule)
    },
    { path: '', pathMatch: 'full', redirectTo: '' },
    { path: '**', redirectTo: '' }
];
