import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceFromComponent } from './invoice-from.component';

describe('InvoiceFromComponent', () => {
  let component: InvoiceFromComponent;
  let fixture: ComponentFixture<InvoiceFromComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvoiceFromComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvoiceFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
