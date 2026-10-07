import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NavigationComponent } from '../navigation/navigation.component';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';

const routes: Routes = [
    {
        path: '',
        component: ProductListComponent
    },
];


@NgModule({
  declarations: [
    ProductFormComponent,
    ProductListComponent
  ],
  imports: [
    CommonModule, NavigationComponent, ReactiveFormsModule, 
    TableModule ,BadgeModule, ButtonModule, DialogModule,
    InputTextModule, InputTextareaModule, ConfirmDialogModule, ToastModule,
    RouterModule.forChild(routes)
  ],
  providers: [ConfirmationService, MessageService]
})
export class ProductModule { }
