import { Component, ViewChild } from '@angular/core';
import { Invoice, InvoiceService } from '../../services/invoice/invoice.service';
import { CustomerService } from '../../services/customer/customer.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InvoiceFromComponent } from '../invoice-from/invoice-from.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.css'
})
export class InvoiceListComponent {

  invoices: Invoice[] = [];
  selectedInvoiceNo: string | null = null;
  isVisible = false;

  @ViewChild(InvoiceFromComponent)
  invoiceForm?: InvoiceFromComponent;

  constructor(
    private invoiceService: InvoiceService,
    public customerService: CustomerService,
    private router: Router,
    private confirmation: ConfirmationService,
    private message: MessageService
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void { this.invoices = this.invoiceService.getAll(); }

  customerName(id: number): string {
    const c = this.customerService.getById(id);
    return c ? `${c.firstName} ${c.lastName}` : 'Unknown';
  }

  add(): void {
    this.selectedInvoiceNo = null;
    this.isVisible = true;
  }

  edit(invoiceNo: string): void {
    this.selectedInvoiceNo = invoiceNo;
    this.isVisible = true;
  }

  view(invoiceNo: string): void {
    this.router.navigate(['/invoice', invoiceNo]);
  }

  delete(invoice: Invoice): void {
    this.confirmation.confirm({
      message: `Delete invoice "${invoice.invoiceNo}"?`,
      header: 'Confirm Delete',
      accept: () => {
        this.invoiceService.delete(invoice.invoiceNo);
        this.load();
        this.message.add({ severity: 'success', summary: 'Deleted', detail: 'Invoice deleted.' });
      }
    });
  }

  saveInvoice(): void {
    if (this.invoiceForm?.save()) {
      this.load();
      this.isVisible = false;
    }
  }
}
