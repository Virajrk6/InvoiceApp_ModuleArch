import { Component, ViewChild } from '@angular/core';
import { Customer, CustomerService } from '../../services/customer/customer.service';
import { InvoiceService } from '../../services/invoice/invoice.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CustomerFormComponent } from '../customer-form/customer-form.component';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent {

  customers: Customer[] = [];
  @ViewChild(CustomerFormComponent)
  customerForm?: CustomerFormComponent;
  selectedCustomerId: number | null = null;

  constructor(
    private customerService: CustomerService,
    private invoiceService: InvoiceService,
    private confirmation: ConfirmationService,
    private message: MessageService
  ) { }

  isVisible: boolean = false;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.customers = this.customerService.getAll();
  }

  edit(id: number): void {
    this.selectedCustomerId = id;
    this.isVisible = true;
  }

  delete(customer: Customer): void {
    if (this.invoiceService.hasCustomer(customer.id)) {
      this.message.add({
        severity: 'warn',
        summary: 'Cannot delete',
        detail: 'Customer is linked with an invoice.'
      });
      return;
    }

    this.confirmation.confirm({
      message: `Delete customer "${customer.firstName} ${customer.lastName}"?`,
      header: 'Confirm Delete',
      icon: 'fa-solid fa-triangle-exclamation',
      accept: () => {
        this.customerService.delete(customer.id);
        this.load();
        this.message.add({ severity: 'success', summary: 'Deleted', detail: 'Customer deleted.' });
      }
    });
  }
  toggleContent(): void {
    this.selectedCustomerId = null;
    this.isVisible = true;
  }

  saveCustomer(): void {
    if (this.customerForm?.save()) {
      this.load();
      this.isVisible = false;
    }
  }
}
