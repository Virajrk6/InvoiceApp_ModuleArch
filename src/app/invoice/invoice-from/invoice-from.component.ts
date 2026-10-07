import { Component, Input, OnInit } from '@angular/core';
import { InvoiceDetail, InvoiceService } from '../../services/invoice/invoice.service';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer/customer.service';
import { ProductService } from '../../services/product/product.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-invoice-from',
  templateUrl: './invoice-from.component.html',
  styleUrl: './invoice-from.component.css'
})
export class InvoiceFromComponent implements OnInit {
  @Input() invoiceNo: string | null = null;
  editingInvoiceNo?: string;

  customers = this.customerService.getAll();
  products = this.productService.getAll();
  details: InvoiceDetail[] = [];

  form = this.fb.group({
    invoiceNo: ['', [Validators.required, Validators.maxLength(10)]],
    invoiceDate: [new Date(), Validators.required],
    customerId: [null as number | null, Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private productService: ProductService,
    private invoiceService: InvoiceService,
    private message: MessageService
  ) {}

  ngOnInit(): void {
    if (this.invoiceNo !== null) {
      this.editingInvoiceNo = this.invoiceNo;
      const invoice = this.invoiceService.getByInvoiceNo(this.invoiceNo);

      if (invoice) {
        this.form.patchValue({
          invoiceNo: invoice.invoiceNo,
          invoiceDate: new Date(invoice.invoiceDate),
          customerId: invoice.customerId
        });
        this.details = (invoice.details || []).map(x => ({ ...x }));
      } else {
        this.message.add({
          severity: 'error',
          summary: 'Invoice not found',
          detail: 'The selected invoice could not be loaded.'
        });
      }
    }

    if (!this.details.length) {
      this.addDetail();
    }
  }

  addDetail(): void {
    this.details.push({
      id: this.nextDetailId(),
      invoiceId: 0,
      productId: 0,
      qty: 1,
      rate: 0
    });
  }

  private nextDetailId(): number {
    const persistedNextId = this.invoiceService.nextDetailId();
    const currentMaxId = this.details.reduce((max, detail) => Math.max(max, detail.id), 0);
    return Math.max(persistedNextId, currentMaxId + 1);
  }

  removeDetail(index: number): void {
    if (this.details.length === 1) {
      this.message.add({
        severity: 'warn',
        summary: 'Required',
        detail: 'Invoice must contain at least one detail.'
      });
      return;
    }

    this.details.splice(index, 1);
  }

  onProductChange(detail: InvoiceDetail): void {
    const product = this.productService.getById(detail.productId);
    // Rate is intentionally editable; a default rate can be added here later.
    if (product && detail.rate === 0) {
      detail.rate = 0;
    }
  }

  productAlreadySelected(productId: number, currentIndex: number): boolean {
    if (!productId) return false;

    return this.details.some((d, index) =>
      index !== currentIndex && d.productId === productId
    );
  }

  get amount(): number {
    return this.details.reduce((sum, d) =>
      sum + (Number(d.qty) || 0) * (Number(d.rate) || 0), 0
    );
  }

  save(): boolean {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }

    const value = this.form.getRawValue();
    const invoiceNo = value.invoiceNo ?? '';

    if (this.invoiceService.existsByInvoiceNo(invoiceNo, this.editingInvoiceNo)) {
      this.message.add({
        severity: 'warn',
        summary: 'Duplicate',
        detail: 'An invoice with the same Invoice No already exists.'
      });
      return false;
    }

    if (!this.details.length || this.details.some(d => !d.productId || d.qty <= 0 || d.rate < 0)) {
      this.message.add({
        severity: 'warn',
        summary: 'Invalid Details',
        detail: 'Every detail needs a product, quantity greater than 0 and a valid rate.'
      });
      return false;
    }

    const duplicateProduct = this.details.some((d, index) =>
      this.details.some((other, otherIndex) =>
        index !== otherIndex && d.productId === other.productId
      )
    );

    if (duplicateProduct) {
      this.message.add({
        severity: 'warn',
        summary: 'Duplicate Product',
        detail: 'The same product cannot be added twice to an invoice.'
      });
      return false;
    }

    const existingInvoice = this.editingInvoiceNo
      ? this.invoiceService.getByInvoiceNo(this.editingInvoiceNo)
      : undefined;
    const invoiceId = existingInvoice?.details.find(detail => detail.invoiceId)?.invoiceId
      ?? this.details[0].id;

    const invoice = {
      invoiceNo,
      invoiceDate: value.invoiceDate instanceof Date
        ? value.invoiceDate.toISOString()
        : new Date(value.invoiceDate ?? Date.now()).toISOString(),
      customerId: value.customerId ?? 0,
      invoiceAmount: this.amount,
      details: this.details.map(d => ({ ...d, invoiceId }))
    };

    if (this.editingInvoiceNo) {
      this.invoiceService.update(invoice);
    } else {
      this.invoiceService.add(invoice);
    }

    this.message.add({ severity: 'success', summary: 'Saved', detail: 'Invoice saved.' });
    return true;
  }

  invalid(control: string): boolean {
    const c = this.form.get(control);
    return !!c && c.invalid && (c.dirty || c.touched);
  }
}
