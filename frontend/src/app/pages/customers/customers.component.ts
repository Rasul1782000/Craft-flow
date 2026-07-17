import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DateRangeOption } from '../../components/dashboard-shell/dashboard-shell.component';

interface CustomerRow {
  name: string;
  email: string;
  plan: string;
  status: string;
  revenue: string;
  location: string;
  ltv: string;
  lastActive: string;
  engagement: string;
  joined?: string;
}

@Component({
  selector: 'app-customers',
  standalone: false,
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isLoading = true;

  summary = [
    { label: 'Total Customers', value: '2,847' },
    { label: 'Active', value: '1,932' },
    { label: 'New This Month', value: '128' },
    { label: 'Churned', value: '43' },
  ];

  customers: CustomerRow[] = [];
  private allCustomers: CustomerRow[] = [];

  enrolledInRange = 0;
  private selectedDays: number | null = 30;

  get activeRangeLabel(): string {
    if (this.selectedDays === null) return 'all time';
    return `in last ${this.selectedDays} days`;
  }

  get selectedRangeId(): string {
    if (this.selectedDays === null) return 'all';
    if (this.selectedDays === 7) return '7d';
    if (this.selectedDays === 90) return '90d';
    return '30d';
  }

  get displayedCount(): number {
    return this.customers.length;
  }

  engagementData = [
    { label: 'High', pct: 48, color: '#ff4500' },
    { label: 'Medium', pct: 32, color: '#ef8f2a' },
    { label: 'Low', pct: 20, color: '#fb7185' },
  ];

  private fallbackCustomers: CustomerRow[] = [
    { name: 'Ava Mitchell', email: 'ava.m@northwind.io', plan: 'Pro', status: 'active', revenue: 'AED 2,184', location: 'San Francisco, CA', ltv: 'AED 8,920', lastActive: '2h ago', engagement: 'High' },
    { name: 'Leo Park', email: 'leo@brightlab.co', plan: 'Team', status: 'active', revenue: 'AED 5,976', location: 'New York, NY', ltv: 'AED 14,500', lastActive: '5h ago', engagement: 'High' },
    { name: 'Maya Reed', email: 'maya@coralstudio.com', plan: 'Pro', status: 'active', revenue: 'AED 1,792', location: 'Austin, TX', ltv: 'AED 6,340', lastActive: '1d ago', engagement: 'Medium' },
    { name: 'Noah Kim', email: 'noah@pinevalley.dev', plan: 'Starter', status: 'inactive', revenue: 'AED 343', location: 'Seattle, WA', ltv: 'AED 980', lastActive: '14d ago', engagement: 'Low' },
    { name: 'Sofia Cruz', email: 'sofia@emberworks.io', plan: 'Team', status: 'active', revenue: 'AED 4,982', location: 'Miami, FL', ltv: 'AED 11,200', lastActive: '3h ago', engagement: 'High' },
    { name: 'Ethan Webb', email: 'ethan@looplane.co', plan: 'Pro', status: 'active', revenue: 'AED 1,536', location: 'Chicago, IL', ltv: 'AED 5,780', lastActive: '8h ago', engagement: 'Medium' },
    { name: 'Isla Chen', email: 'isla@stellardesign.co', plan: 'Enterprise', status: 'active', revenue: 'AED 12,600', location: 'Los Angeles, CA', ltv: 'AED 42,000', lastActive: '1h ago', engagement: 'High' },
    { name: 'James Harper', email: 'james@axiom.dev', plan: 'Starter', status: 'inactive', revenue: 'AED 196', location: 'Denver, CO', ltv: 'AED 520', lastActive: '21d ago', engagement: 'Low' },
    { name: 'Zara Patel', email: 'zara@cyanwave.io', plan: 'Pro', status: 'active', revenue: 'AED 2,450', location: 'Portland, OR', ltv: 'AED 7,300', lastActive: '6h ago', engagement: 'Medium' },
    { name: 'Marcus Bell', email: 'marcus@redpoint.co', plan: 'Team', status: 'active', revenue: 'AED 3,840', location: 'Boston, MA', ltv: 'AED 9,600', lastActive: '12h ago', engagement: 'High' },
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.allCustomers = [...this.fallbackCustomers];
    this.applyFilters();
    this.computeEnrolled();
    this.api.getCustomers().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.customers && res.customers.length) {
          this.allCustomers = res.customers.map((c) => ({
            name: `${c.first_name} ${c.last_name}`,
            email: c.email,
            plan: (c as any).plan || 'Pro',
            status: (c as any).status || 'active',
            revenue: (c as any).revenue || 'AED 0',
            location: (c as any).location || '-',
            ltv: (c as any).ltv || 'AED 0',
            lastActive: (c as any).last_active || '-',
            engagement: (c as any).engagement || 'Medium',
            joined: (c as any).joined || c.created_at,
          }));
        }
        if (res.summary) {
          const s = res.summary as any;
          this.summary = [
            { label: 'Total Customers', value: s.total?.toLocaleString() || this.summary[0].value },
            { label: 'Active', value: s.active?.toLocaleString() || this.summary[1].value },
            { label: 'New This Month', value: s.new_this_month?.toLocaleString() || this.summary[2].value },
            { label: 'Churned', value: s.churned_this_month?.toLocaleString() || this.summary[3].value },
          ];
        }
        this.applyFilters();
        this.computeEnrolled();
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

  onSearch(query: string): void {
    this.searchQuery = query;
    this.applyFilters();
  }

  onRangeChange(range: DateRangeOption): void {
    this.selectedDays = range.days;
    this.computeEnrolled();
  }

  private searchQuery = '';

  private applyFilters(): void {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      this.customers = [...this.allCustomers];
      return;
    }
    this.customers = this.allCustomers.filter((c) =>
      [c.name, c.email, c.plan, c.status, c.location, c.engagement]
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }

  private computeEnrolled(): void {
    if (this.selectedDays === null) {
      this.enrolledInRange = this.allCustomers.length;
      return;
    }
    const cutoff = Date.now() - this.selectedDays * 24 * 60 * 60 * 1000;
    this.enrolledInRange = this.allCustomers.filter((c) => {
      if (!c.joined) return false;
      const t = new Date(c.joined).getTime();
      return !isNaN(t) && t >= cutoff;
    }).length;
  }

  initials(name: string): string {
    return name.split(' ').map(w => w[0]).join('');
  }

  avatarColor(name: string): string {
    const colors = ['#ff4500', '#ef8f2a', '#fb7185', '#d9a06b'];
    const i = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return colors[i % colors.length];
  }

  engagementColor(e: string): string {
    switch (e) {
      case 'High': return '#ff4500';
      case 'Medium': return '#ef8f2a';
      case 'Low': return '#fb7185';
      default: return '#64748b';
    }
  }

  donutCirc = 2 * Math.PI * 54;

  donutDash(pct: number): string {
    return `${(pct / 100) * this.donutCirc} ${this.donutCirc}`;
  }

  donutOffset(i: number): number {
    let offset = 0;
    for (let j = 0; j < i; j++) {
      offset += (this.engagementData[j].pct / 100) * this.donutCirc;
    }
    return -offset;
  }
}
