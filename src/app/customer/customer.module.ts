import { CommonModule } from '@angular/common';
import { NgModule, } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { NavigationComponent } from '../navigation/navigation.component';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';

let routers :Routes= [
    {
        path: '',
        component: CustomerListComponent
    },
  ];

@NgModule({
  declarations: [
    CustomerListComponent,
    CustomerFormComponent
  ],
  imports: [CommonModule, ReactiveFormsModule, 
    ButtonModule, InputTextModule, TableModule, 
    BadgeModule, NavigationComponent, FontAwesomeModule, 
    DialogModule, ConfirmDialogModule, ToastModule, InputNumberModule,
    RouterModule.forChild(routers)
  ],
  exports: [RouterModule],
  providers: [ConfirmationService, MessageService]

})
export class CustomerModule { }
