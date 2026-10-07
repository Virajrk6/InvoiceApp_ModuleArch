import { Component, ViewChild } from '@angular/core';
import { Product, ProductService } from '../../services/product/product.service';
import { InvoiceService } from '../../services/invoice/invoice.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductFormComponent } from '../product-form/product-form.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {

  products: Product[] = [];
  selectedProductId: number | null = null;

  @ViewChild(ProductFormComponent)
  productForm?: ProductFormComponent;

  constructor(
    private productService: ProductService,
    private invoiceService: InvoiceService,
    private confirmation: ConfirmationService,
    private message: MessageService
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void { this.products = this.productService.getAll(); }

  add(): void {
    this.selectedProductId = null;
    this.isVisible = true;
  }

  edit(id: number): void {
    this.selectedProductId = id;
    this.isVisible = true;
  }

  isVisible = false;

  delete(product: Product): void {
    if (this.invoiceService.hasProduct(product.id)) {
      this.message.add({
        severity: 'warn',
        summary: 'Cannot delete',
        detail: 'Product is linked with an Invoice Detail.'
      });
      return;
    }

    this.confirmation.confirm({
      message: `Delete product "${product.name}"?`,
      header: 'Confirm Delete',
      accept: () => {
        this.productService.delete(product.id);
        this.load();
        this.message.add({ severity: 'success', summary: 'Deleted', detail: 'Product deleted.' });
      }
    });
  }

  saveProduct(): void {
    if (this.productForm?.save()) {
      this.load();
      this.isVisible = false;
    }
  }
}
