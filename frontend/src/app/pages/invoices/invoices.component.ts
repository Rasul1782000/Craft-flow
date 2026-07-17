import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface InvoiceRow {
  id: string;
  customer: string;
  amount: string;
  status: string;
  due: string;
  description: string;
  paymentMethod: string;
}

@Component({
  selector: 'app-invoices',
  standalone: false,
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
})
export class InvoicesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isLoading = true;

  summary = [
    { label: 'Outstanding', value: 'AED 24,840' },
    { label: 'Paid This Month', value: 'AED 18,240' },
    { label: 'Overdue', value: 'AED 3,420' },
    { label: 'Pending', value: 'AED 6,180' },
  ];

  invoices: InvoiceRow[] = [];

  agingData = [
    { label: 'Current', pct: 62, color: '#ff4500' },
    { label: '1-30 days', pct: 21, color: '#ef8f2a' },
    { label: '31-60 days', pct: 10, color: '#fb7185' },
    { label: '60+ days', pct: 7, color: '#d9a06b' },
  ];

  paymentMethods = [
    { label: 'Credit Card', pct: 58, color: '#ff4500' },
    { label: 'ACH Transfer', pct: 24, color: '#ef8f2a' },
    { label: 'PayPal', pct: 12, color: '#fb7185' },
    { label: 'Other', pct: 6, color: '#d9a06b' },
  ];

  private fallbackInvoices: InvoiceRow[] = [
    { id: 'INV-2025-001', customer: 'Ava Mitchell', amount: 'AED 249.00', status: 'paid', due: 'Jul 15', description: 'Pro Monthly', paymentMethod: 'Credit Card' },
    { id: 'INV-2025-002', customer: 'Leo Park', amount: 'AED 599.00', status: 'pending', due: 'Jul 16', description: 'Team Monthly', paymentMethod: 'ACH Transfer' },
    { id: 'INV-2025-003', customer: 'Maya Reed', amount: 'AED 249.00', status: 'paid', due: 'Jul 19', description: 'Pro Monthly', paymentMethod: 'Credit Card' },
    { id: 'INV-2025-004', customer: 'Noah Kim', amount: 'AED 49.00', status: 'overdue', due: 'Jun 29', description: 'Starter Monthly', paymentMethod: 'PayPal' },
    { id: 'INV-2025-005', customer: 'Sofia Cruz', amount: 'AED 599.00', status: 'paid', due: 'Jul 22', description: 'Team Monthly', paymentMethod: 'ACH Transfer' },
    { id: 'INV-2025-006', customer: 'Ethan Webb', amount: 'AED 249.00', status: 'pending', due: 'Jul 24', description: 'Pro Monthly', paymentMethod: 'Credit Card' },
    { id: 'INV-2025-007', customer: 'Isla Chen', amount: 'AED 1,050.00', status: 'paid', due: 'Jul 31', description: 'Enterprise Monthly', paymentMethod: 'ACH Transfer' },
    { id: 'INV-2025-008', customer: 'James Harper', amount: 'AED 49.00', status: 'overdue', due: 'Jun 15', description: 'Starter Monthly', paymentMethod: 'PayPal' },
    { id: 'INV-2025-009', customer: 'Zara Patel', amount: 'AED 249.00', status: 'paid', due: 'Aug 2', description: 'Pro Monthly', paymentMethod: 'Credit Card' },
    { id: 'INV-2025-010', customer: 'Marcus Bell', amount: 'AED 599.00', status: 'pending', due: 'Aug 5', description: 'Team Monthly', paymentMethod: 'ACH Transfer' },
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.invoices = [...this.fallbackInvoices];
    this.api.getInvoices().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.invoices && res.invoices.length) {
          this.invoices = res.invoices.map((inv) => ({
            id: inv.id,
            customer: inv.customer,
            amount: inv.amount,
            status: inv.status,
            due: inv.due_date,
            description: (inv as any).description || '-',
            paymentMethod: (inv as any).payment_method || '-',
          }));
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  statusColor(status: string): string {
    switch (status) {
      case 'paid': return 'text-green-400 bg-green-400/10';
      case 'pending': return 'text-amber-400 bg-amber-400/10';
      case 'overdue': return 'text-rose-400 bg-rose-400/10';
      default: return 'text-[#64748b] bg-white/[0.06]';
    }
  }

  donutCirc = 2 * Math.PI * 54;

  donutDash(pct: number): string {
    return `${(pct / 100) * this.donutCirc} ${this.donutCirc}`;
  }

  donutOffset(data: { pct: number }[], i: number): number {
    let offset = 0;
    for (let j = 0; j < i; j++) {
      offset += (data[j].pct / 100) * this.donutCirc;
    }
    return -offset;
  }
}
