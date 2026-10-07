import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer/customer.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.css'
})
export class CustomerFormComponent implements OnInit {

  @Input() customerId: number | null = null;
  editingId?: number;

  form = this.fb.group({
    code: ['', [Validators.required, Validators.maxLength(20)]],
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
  });

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private message: MessageService
  ) {}

  ngOnInit(): void {
    if (this.customerId !== null) {
      this.editingId = this.customerId;
      const customer = this.customerService.getById(this.customerId);
      if (!customer) {
        this.message.add({
          severity: 'error',
          summary: 'Customer not found',
          detail: 'The selected customer could not be loaded.'
        });
        return;
      }
      this.form.patchValue(customer);
    }
  }

  save(): boolean {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }

    const value = this.form.getRawValue();
    const firstName = value.firstName ?? '';
    const lastName = value.lastName ?? '';

    if (this.customerService.existsByName(firstName, lastName, this.editingId)) {
      this.message.add({
        severity: 'warn',
        summary: 'Duplicate',
        detail: 'A customer with the same First Name and Last Name already exists.'
      });
      return false;
    }

    const customer = {
      id: this.editingId ?? this.customerService.nextId(),
      code: value.code ?? '',
      firstName,
      lastName,
      email: value.email ?? '',
      mobile: value.mobile ?? ''
    };

    this.editingId
      ? this.customerService.update(customer)
      : this.customerService.add(customer);

    this.message.add({ severity: 'success', summary: 'Saved', detail: 'Customer saved.' });
    return true;
  }

  invalid(control: string): boolean {
    const c = this.form.get(control);
    return !!c && c.invalid && (c.dirty || c.touched);
  }
}
