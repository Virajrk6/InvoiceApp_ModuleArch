import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';

export interface Invoice {
  invoiceNo: string;
  invoiceDate: string;
  customerId: number;
  invoiceAmount: number;
  details: InvoiceDetail[];
}

export interface InvoiceDetail {
  id: number;
  invoiceId: number;
  productId: number;
  qty: number;
  rate: number;
}
@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private readonly key = 'invoices';

  constructor(private storage: StorageService) { }

  getAll(): Invoice[] {
    return this.storage.get<Invoice[]>(this.key, []);
  }

  getByInvoiceNo(invoiceNo: string): Invoice | undefined {
    return this.getAll().find(x => x.invoiceNo === invoiceNo);
  }

  existsByInvoiceNo(invoiceNo: string, excludeInvoiceNo?: string): boolean {
    const value = invoiceNo.trim().toLowerCase();
    return this.getAll().some(x =>
      x.invoiceNo !== excludeInvoiceNo &&
      x.invoiceNo.trim().toLowerCase() === value
    );
  }

  hasCustomer(customerId: number): boolean {
    return this.getAll().some(x => x.customerId === customerId);
  }

  hasProduct(productId: number): boolean {
    return this.getAll().some(x =>
      x.details.some(d => d.productId === productId)
    );
  }

  add(invoice: Invoice): void {
    const data = this.getAll();
    data.push(invoice);
    this.storage.set(this.key, data);
  }

  update(invoice: Invoice): void {
    const data = this.getAll();
    const index = data.findIndex(x => x.invoiceNo === invoice.invoiceNo);
    if (index >= 0) {
      data[index] = invoice;
      this.storage.set(this.key, data);
    }
  }

  delete(invoiceNo: string): void {
    this.storage.set(this.key, this.getAll().filter(x => x.invoiceNo !== invoiceNo));
  }

  nextDetailId(): number {
    const details = this.getAll().flatMap(x => x.details || []);
    return details.length ? Math.max(...details.map(x => x.id)) + 1 : 1;
  }
}