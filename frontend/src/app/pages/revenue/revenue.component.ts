import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-revenue',
  standalone: false,
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.scss'],
})
export class RevenueComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isLoading = true;

  metrics = [
    { label: 'MRR', value: 'AED 42,180', delta: '+12.4%', up: true },
    { label: 'ARR', value: 'AED 506,160', delta: '+15.8%', up: true },
    { label: 'Churn Rate', value: '3.2%', delta: '+0.8%', up: false },
    { label: 'LTV', value: 'AED 2,840', delta: '+7.6%', up: true },
  ];

  plans = [
    { name: 'Starter', revenue: 'AED 18,200', subscribers: 364, color: '#ff4500' },
    { name: 'Pro', revenue: 'AED 31,500', subscribers: 210, color: '#ef8f2a' },
    { name: 'Team', revenue: 'AED 24,800', subscribers: 62, color: '#fb7185' },
    { name: 'Enterprise', revenue: 'AED 12,600', subscribers: 14, color: '#d9a06b' },
  ];

  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  revenueThis = [42, 48, 45, 56, 61, 67, 74, 71, 82, 90, 96, 104];
  revenueLast = [33, 38, 41, 43, 49, 51, 57, 59, 64, 67, 70, 76];

  revenueLinePath = '';
  revenueAreaPath = '';
  revenueLastPath = '';
  endPct = { x: 0, y: 0 };
  midPct = { x: 0, y: 0 };

  projections = [
    { month: 'Aug', projected: 'AED 112K', growth: '+7.7%' },
    { month: 'Sep', projected: 'AED 121K', growth: '+8.0%' },
    { month: 'Oct', projected: 'AED 130K', growth: '+7.4%' },
  ];

  growthData = [
    { label: 'Q1 Growth', value: '14.2%', change: 'up' },
    { label: 'Q2 Growth', value: '16.8%', change: 'up' },
    { label: 'Q3 (est.)', value: '18.5%', change: 'up' },
    { label: 'YoY Comparison', value: '+24.3%', change: 'up' },
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.buildRevenueChart();
    this.api.getRevenue().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.metrics = [
          { label: 'MRR', value: `AED ${(res.monthly_recurring || 42180).toLocaleString()}`, delta: '+12.4%', up: true },
          { label: 'ARR', value: `AED ${(res.annual_recurring || 506160).toLocaleString()}`, delta: '+15.8%', up: true },
          { label: 'Churn Rate', value: `${res.churn_rate || 3.2}%`, delta: '+0.8%', up: false },
          { label: 'LTV', value: `AED ${(res.lifetime_value || 2840).toLocaleString()}`, delta: '+7.6%', up: true },
        ];
        if (res.plan_breakdown && res.plan_breakdown.length) {
          this.plans = res.plan_breakdown.map((p, i) => ({
            name: p.plan,
            revenue: `AED ${p.revenue.toLocaleString()}`,
            subscribers: p.subscribers,
            color: this.plans[i]?.color || '#ff4500',
          }));
        }
        if (res.revenue_over_time) {
          this.revenueThis = res.revenue_over_time.this_year || this.revenueThis;
          this.revenueLast = res.revenue_over_time.last_year || this.revenueLast;
          this.buildRevenueChart();
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

  private buildRevenueChart(): void {
    const W = 1000;
    const H = 300;
    const top = 24;
    const bottom = 270;
    const left = 30;
    const right = 970;
    const all = [...this.revenueThis, ...this.revenueLast];
    const max = Math.max(...all) * 1.05;
    const step = (right - left) / (this.revenueThis.length - 1);

    const toPoints = (vals: number[]) =>
      vals.map((v, i) => ({ x: left + i * step, y: bottom - (v / max) * (bottom - top) }));

    const thisPts = toPoints(this.revenueThis);
    const lastPts = toPoints(this.revenueLast);

    this.revenueLinePath = this.smooth(thisPts);
    this.revenueAreaPath = `${this.revenueLinePath} L ${right} ${bottom} L ${left} ${bottom} Z`;
    this.revenueLastPath = this.smooth(lastPts);
    const endPoint = thisPts[thisPts.length - 1];
    const midPoint = thisPts[Math.floor(thisPts.length / 2)];
    this.endPct = { x: (endPoint.x / W) * 100, y: (endPoint.y / H) * 100 };
    this.midPct = { x: (midPoint.x / W) * 100, y: (midPoint.y / H) * 100 };
  }

  private smooth(pts: { x: number; y: number }[]): string {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  }
}
