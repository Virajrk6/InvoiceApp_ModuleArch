import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceFromComponent } from './invoice-from/invoice-from.component';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
import { NavigationComponent } from '../navigation/navigation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';

const routes: Routes = [
  {
    path: '',
    component: InvoiceListComponent
  },
  {
    path: ':id',
    component: InvoiceDetailsComponent
  }
];

@NgModule({
  declarations: [
    InvoiceListComponent,
    InvoiceFromComponent,
    InvoiceDetailsComponent
  ],
  imports: [
    CommonModule, NavigationComponent, ReactiveFormsModule,
     ButtonModule, TableModule, InputTextModule, CalendarModule, DropdownModule,
      DecimalPipe, CurrencyPipe, FormsModule, InputNumberModule,
     DialogModule, ConfirmDialogModule, ToastModule, TooltipModule,
    RouterModule.forChild(routes)
  ],
  providers: [ConfirmationService, MessageService]
})
export class InvoiceModule { }
