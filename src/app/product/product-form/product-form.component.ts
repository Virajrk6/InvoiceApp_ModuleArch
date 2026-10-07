import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../../services/product/product.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit{

  @Input() productId: number | null = null;
  editingId?: number;

  form = this.fb.group({
    code: ['', [Validators.required, Validators.maxLength(20)]],
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(500)]]
  });

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private message: MessageService
  ) {}

  ngOnInit(): void {
    if (this.productId !== null) {
      this.editingId = this.productId;
      const product = this.productService.getById(this.productId);
      if (!product) {
        this.message.add({
          severity: 'error',
          summary: 'Product not found',
          detail: 'The selected product could not be loaded.'
        });
        return;
      }
      this.form.patchValue(product);
    }
  }

  save(): boolean {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }

    const value = this.form.getRawValue();
    const name = value.name ?? '';

    if (this.productService.existsByName(name, this.editingId)) {
      this.message.add({
        severity: 'warn',
        summary: 'Duplicate',
        detail: 'A product with the same name already exists.'
      });
      return false;
    }

    const product = {
      id: this.editingId ?? this.productService.nextId(),
      code: value.code ?? '',
      name,
      description: value.description ?? ''
    };

    this.editingId
      ? this.productService.update(product)
      : this.productService.add(product);

    this.message.add({ severity: 'success', summary: 'Saved', detail: 'Product saved.' });
    return true;
  }

  invalid(control: string): boolean {
    const c = this.form.get(control);
    return !!c && c.invalid && (c.dirty || c.touched);
  }
}