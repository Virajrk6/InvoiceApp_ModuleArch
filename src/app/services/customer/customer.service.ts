import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';

export interface Customer {
  id: number;
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
}


@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly key = 'customers';

  constructor(private storage: StorageService) { }

  getAll(): Customer[] {
    return this.storage.get<Customer[]>(this.key, []);
  }

  getById(id: number): Customer | undefined {
    return this.getAll().find(x => x.id === id);
  }

  existsByName(firstName: string, lastName: string, excludeId?: number): boolean {
    const first = firstName.trim().toLowerCase();
    const last = lastName.trim().toLowerCase();

    return this.getAll().some(x =>
      x.id !== excludeId &&
      x.firstName.trim().toLowerCase() === first &&
      x.lastName.trim().toLowerCase() === last
    );
  }

  add(customer: Customer): void {
    const data = this.getAll();
    data.push(customer);
    this.storage.set(this.key, data);
  }

  update(customer: Customer): void {
    const data = this.getAll();
    const index = data.findIndex(x => x.id === customer.id);
    if (index >= 0) {
      data[index] = customer;
      this.storage.set(this.key, data);
    }
  }

  delete(id: number): void {
    this.storage.set(this.key, this.getAll().filter(x => x.id !== id));
  }

  nextId(): number {
    const data = this.getAll();
    return data.length ? Math.max(...data.map(x => x.id)) + 1 : 1;
  }

  clearAll() {
    this.storage.clear();
  }
}
