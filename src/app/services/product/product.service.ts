import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';

export interface Product {
  id: number;
  code: string;
  name: string;
  description: string;
}
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly key = 'products';

 constructor(private storage: StorageService) {}

  getAll(): Product[] {
    return this.storage.get<Product[]>(this.key, []);
  }

  getById(id: number): Product | undefined {
    return this.getAll().find(x => x.id === id);
  }

  existsByName(name: string, excludeId?: number): boolean {
    const value = name.trim().toLowerCase();
    return this.getAll().some(x =>
      x.id !== excludeId && x.name.trim().toLowerCase() === value
    );
  }

  add(product: Product): void {
    const data = this.getAll();
    data.push(product);
    this.storage.set(this.key, data);
  }

  update(product: Product): void {
    const data = this.getAll();
    const index = data.findIndex(x => x.id === product.id);
    if (index >= 0) {
      data[index] = product;
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
}
