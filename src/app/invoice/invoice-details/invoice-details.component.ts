import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../../services/customer/customer.service';
import { CustomerService } from '../../services/customer/customer.service';
import { Invoice, InvoiceDetail, InvoiceService } from '../../services/invoice/invoice.service';
import { ProductService } from '../../services/product/product.service';

type InvoiceDetailWithProductName = InvoiceDetail & { productName: string };

type InvoiceWithProductNames = Omit<Invoice, 'details'> & {
  details: InvoiceDetailWithProductName[];
};

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.css'
})
export class InvoiceDetailsComponent implements OnInit {
  invoice: InvoiceWithProductNames | null = null;
  customer: Customer | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoiceService,
    private customerService: CustomerService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const invoiceNo = this.route.snapshot.paramMap.get('id');

    if (!invoiceNo) {
      void this.router.navigate(['/invoice']);
      return;
    }

    const invoice = this.invoiceService.getByInvoiceNo(invoiceNo);
    if (!invoice) {
      void this.router.navigate(['/invoice']);
      return;
    }

    this.customer = this.customerService.getById(invoice.customerId);
    const products = this.productService.getAll();
    this.invoice = {
      ...invoice,
      details: invoice.details.map(detail => ({
        ...detail,
        productName: products.find(product => product.id === detail.productId)?.name
          ?? 'Unknown Product'
      }))
    };
  }

  printInvoice(): void {
    window.print();
  }
}
