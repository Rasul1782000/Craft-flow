import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService, StoredUser } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { ActivityEvent, ActivityStatus } from '../../services/api.types';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';


interface NavItem {
  id: string;
  label: string;
  icon: 'dashboard' | 'wallet' | 'users' | 'receipt' | 'settings' | 'help' | 'properties';
  route: string;
  badge?: number;
}

interface Kpi {
  label: string;
  value: string;
  delta: string;
  up: boolean;
  icon: 'revenue' | 'users' | 'conversion' | 'cart' | 'uptime' | 'bounce' | 'views' | 'newusers' | 'sessions';
  spark: number[];
  sparkPath: string;
}

interface Source {
  label: string;
  pct: number;
  color: 'coral' | 'amber' | 'rose' | 'tan';
  dash: number;
  offset: number;
}

interface Transaction {
  name: string;
  email: string;
  avatar: string;
  avatarColor: string;
  plan: string;
  date: string;
  status: 'Completed' | 'In Progress' | 'Attention Required';
  amount: string;
}

interface ActivityItem {
  actor: string;
  email: string;
  initials: string;
  color: string;
  action: string;
  target: string;
  status: ActivityStatus;
  amount: string;
  date: string;
}

interface ProgressBar {
  label: string;
  pct: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false,
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  activeNav = 'dashboard';
  isLoading = true;
  userName = 'Jordan Cox';

  get userInitials(): string {
    const parts = this.userName.split(' ');
    if (parts.length >= 2) {
      return parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
    }
    return this.userName.charAt(0);
  }

  navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { id: 'wallet', label: 'Revenue', icon: 'wallet', route: '/dashboard/revenue' },
    { id: 'users', label: 'Customers', icon: 'users', route: '/dashboard/customers' },
    { id: 'receipt', label: 'Invoices', icon: 'receipt', route: '/dashboard/invoices', badge: 2 },
    { id: 'properties', label: 'Properties', icon: 'properties', route: '/dashboard/properties' },
    { id: 'settings', label: 'Settings', icon: 'settings', route: '/dashboard/settings' },
  ];

  helpBadge = 1;
  pageTitle = 'Overview';
  pageGreeting = "Good afternoon, Jordan — here's what's happening today.";

  kpis: Kpi[] = [];

  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  revenueThis = [42, 48, 45, 56, 61, 67, 74, 71, 82, 90, 96, 104];
  revenueLast = [33, 38, 41, 43, 49, 51, 57, 59, 64, 67, 70, 76];

  revenueAreaPath = '';
  revenueLinePath = '';
  revenueLastPath = '';
  endPoint = { x: 0, y: 0 };
  midPoint = { x: 0, y: 0 };
  endPct = { x: 0, y: 0 };
  midPct = { x: 0, y: 0 };

  donutCirc = 2 * Math.PI * 54;
  sources: Source[] = [];
  totalVisitors = '48.2k';

  transactions: Transaction[] = [];
  activities: ActivityItem[] = [];

  goalPct = 99.98;
  goalRingDash = '';
  progressBars: ProgressBar[] = [
    { label: 'API latency', pct: 86 },
    { label: 'Error rate', pct: 97 },
    { label: 'Throughput', pct: 92 },
  ];

  devices = [
    { label: 'Desktop', pct: 52, color: '#ff4500' },
    { label: 'Mobile', pct: 38, color: '#ef8f2a' },
    { label: 'Tablet', pct: 10, color: '#d9a06b' },
  ];

  browsers = [
    { label: 'Chrome', pct: 64, color: '#ff4500' },
    { label: 'Safari', pct: 18, color: '#ef8f2a' },
    { label: 'Firefox', pct: 12, color: '#fb7185' },
    { label: 'Edge', pct: 6, color: '#d9a06b' },
  ];

  topPages = [
    { path: '/pricing', views: '48,230', trend: 'up' as const },
    { path: '/product', views: '32,184', trend: 'up' as const },
    { path: '/library', views: '21,906', trend: 'down' as const },
    { path: '/docs', views: '18,542', trend: 'up' as const },
    { path: '/expertise', views: '12,778', trend: 'stable' as const },
  ];

  insights: { title: string; text: string; tag: 'info' | 'growth' | 'alert'; metric?: string; metricLabel?: string; time?: string }[] = [
    { title: 'Peak traffic at 14:00 UTC', text: 'Sessions rose 22% over the last 7 days during mid-day windows.', tag: 'growth', metric: '+22%', metricLabel: 'sessions', time: '2m ago' },
    { title: 'API latency spike detected', text: 'p95 latency crossed 200ms for 4 minutes before auto-healing.', tag: 'alert', metric: '204ms', metricLabel: 'p95', time: '18m ago' },
    { title: 'New pricing funnel deployed', text: 'The updated funnel captures 0.8% more conversions than baseline.', tag: 'info', metric: '+0.8%', metricLabel: 'conv.', time: '1h ago' },
    { title: 'Bounce rate improved', text: 'Down 3.2% after the new onboarding flow shipped last Thursday.', tag: 'growth', metric: '-3.2%', metricLabel: 'bounce', time: '3h ago' },
    { title: 'CDN cache-miss threshold breached', text: 'Cache misses spiked to 12% in EU region; investigation pending.', tag: 'alert', metric: '12%', metricLabel: 'misses', time: '5h ago' },
    { title: 'Weekly report ready', text: 'Performance summary for Jul 7\u201313 is available for download.', tag: 'info', time: '8h ago' },
  ];

  constructor(
    private router: Router,
    private readonly auth: AuthService,
    private readonly api: ApiService,
  ) {}

  private sectionMeta: Record<string, { title: string; greeting: string }> = {
    wallet: { title: 'Revenue', greeting: 'Monitor your earnings and projections.' },
    users: { title: 'Customers', greeting: 'Manage your customer base and insights.' },
    receipt: { title: 'Invoices', greeting: 'Review and manage all billing records.' },
    settings: { title: 'Settings', greeting: 'Configure your account and preferences.' },
  };

  ngOnInit(): void {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    const theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);

    const user = this.auth.getUser();
    if (user) {
      const first = user.first_name || 'Jordan';
      const last = user.last_name || 'Cox';
      this.userName = `${first} ${last}`;
    }

    this.syncNavFromUrl(this.router.url);

    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.syncNavFromUrl(this.router.url));

    this.loadDashboard();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDashboard(): void {
    this.api.getDashboard().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.user) {
          this.userName = res.user.first_name || 'Jordan';
        }
        if (res.kpis && res.kpis.length) {
          this.kpis = res.kpis.map((k) => ({
            label: k.label,
            value: k.value,
            delta: k.positive ? `+${k.delta}%` : `-${k.delta}%`,
            up: k.positive,
            icon: (k.icon || 'users') as Kpi['icon'],
            spark: k.spark || [],
            sparkPath: this.sparkline(k.spark || []),
          }));
        } else {
          this.buildKpis();
        }
        if (res.revenue) {
          this.revenueThis = res.revenue.this_year || this.revenueThis;
          this.revenueLast = res.revenue.last_year || this.revenueLast;
          this.months = res.revenue.months || this.months;
        }
        this.buildRevenueChart();
        if (res.transactions && res.transactions.length) {
          this.transactions = res.transactions.map((t) => ({
            name: t.name,
            email: t.email,
            avatar: t.initials,
            avatarColor: t.color,
            plan: t.plan,
            date: t.date,
            status: t.status as Transaction['status'],
            amount: t.amount,
          }));
        }
        this.loadActivity();
        if (res.traffic && res.traffic.length) {
          const colorMap: Record<string, Source['color']> = {
            '#f2521b': 'coral',
            '#ef8f2a': 'amber',
            '#fb7185': 'rose',
            '#d9a066': 'tan',
            '#ff4500': 'coral',
            '#d9a06b': 'tan',
          };
          const r = 54;
          const circ = 2 * Math.PI * r;
          let acc = 0;
          this.sources = res.traffic.map((t) => {
            const len = (t.percent / 100) * circ;
            const dash = len;
            const offset = -acc;
            acc += len;
            return {
              label: t.label,
              pct: t.percent,
              color: colorMap[t.color] || 'coral',
              dash,
              offset,
            };
          });
        }
        if (res.goal) {
          this.goalPct = res.goal.percent || 99.98;
          if (res.goal.progress && res.goal.progress.length) {
            this.progressBars = res.goal.progress.map((p) => ({ label: p.label, pct: p.percent }));
          }
        }
        this.buildDonut();
        this.buildGoal();
        this.isLoading = false;
      },
      error: () => {
        this.buildKpis();
        this.buildRevenueChart();
        this.buildDonut();
        this.buildGoal();
        this.transactions = [
          { name: 'Ava Mitchell', email: 'ava.m@northwind.io', avatar: 'AM', avatarColor: '#f2521b', plan: 'Pro', date: 'Jul 12', status: 'Completed', amount: 'AED 128.40' },
          { name: 'Leo Park', email: 'leo@brightlab.co', avatar: 'LP', avatarColor: '#ef8f2a', plan: 'Team', date: 'Jul 12', status: 'In Progress', amount: 'AED 498.00' },
          { name: 'Maya Reed', email: 'maya@coralstudio.com', avatar: 'MR', avatarColor: '#fb7185', plan: 'Pro', date: 'Jul 11', status: 'Completed', amount: 'AED 128.40' },
          { name: 'Noah Kim', email: 'noah@pinevalley.dev', avatar: 'NK', avatarColor: '#d9a06b', plan: 'Starter', date: 'Jul 11', status: 'Attention Required', amount: 'AED 49.00' },
          { name: 'Sofia Cruz', email: 'sofia@emberworks.io', avatar: 'SC', avatarColor: '#f2521b', plan: 'Team', date: 'Jul 10', status: 'Completed', amount: 'AED 498.00' },
          { name: 'Ethan Webb', email: 'ethan@looplane.co', avatar: 'EW', avatarColor: '#ef8f2a', plan: 'Pro', date: 'Jul 10', status: 'In Progress', amount: 'AED 128.40' },
        ];
        this.isLoading = false;
      },
    });
  }

  private loadActivity(): void {
    this.api.getActivity().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.events && res.events.length) {
          this.activities = res.events.map((e) => ({
            actor: e.actor,
            email: e.actor_email || '',
            initials: e.initials,
            color: e.color,
            action: e.action,
            target: e.target,
            status: e.status,
            amount: e.amount || '',
            date: e.date,
          }));
        } else {
          this.seedActivityFallback();
        }
      },
      error: () => this.seedActivityFallback(),
    });
  }

  private seedActivityFallback(): void {
    this.activities = [
      { actor: 'Ava Mitchell', email: 'ava.m@northwind.io', initials: 'AM', color: '#f2521b', action: 'subscribed to', target: 'Pro plan', status: 'completed', amount: 'AED 128.40', date: 'Jul 12' },
      { actor: 'Leo Park', email: 'leo@brightlab.co', initials: 'LP', color: '#ef8f2a', action: 'upgraded to', target: 'Team plan', status: 'processing', amount: 'AED 498.00', date: 'Jul 12' },
      { actor: 'Maya Reed', email: 'maya@coralstudio.com', initials: 'MR', color: '#fb7185', action: 'renewed', target: 'Pro plan', status: 'completed', amount: 'AED 128.40', date: 'Jul 11' },
      { actor: 'Noah Kim', email: 'noah@pinevalley.dev', initials: 'NK', color: '#d9a06b', action: 'payment failed for', target: 'Starter plan', status: 'failed', amount: 'AED 49.00', date: 'Jul 11' },
      { actor: 'Sofia Cruz', email: 'sofia@emberworks.io', initials: 'SC', color: '#f2521b', action: 'subscribed to', target: 'Team plan', status: 'completed', amount: 'AED 498.00', date: 'Jul 10' },
      { actor: 'Ethan Webb', email: 'ethan@looplane.co', initials: 'EW', color: '#ef8f2a', action: 'invited to', target: 'workspace', status: 'pending', amount: '', date: 'Jul 10' },
    ];
  }

  private syncNavFromUrl(url: string): void {
    const item = this.navItems.find((n) => n.route === url);
    const isHelp = url === '/dashboard/help';
    this.activeNav = item ? item.id : isHelp ? 'help' : 'dashboard';
    if (isHelp) {
      this.pageTitle = 'Help & Support';
      this.pageGreeting = 'Find answers and get assistance.';
    } else if (item) {
      const meta = this.sectionMeta[item.id];
      if (meta) {
        this.pageTitle = meta.title;
        this.pageGreeting = meta.greeting;
      }
    } else {
      this.pageTitle = 'Overview';
      this.pageGreeting = `Good afternoon, ${this.userName} — here's what's happening today.`;
    }
  }

  setNav(item: NavItem): void {
    this.router.navigate([item.route]);
  }

  goHelp(): void {
    this.router.navigate(['/dashboard/help']);
  }

  logout(): void {
    this.auth.logout();
  }

  private buildKpis(): void {

    const raw: Omit<Kpi, 'sparkPath'>[] = [
      { label: 'Active users', value: '12,847', delta: '+8.4%', up: true, icon: 'users', spark: [30, 28, 34, 36, 33, 40, 44, 42, 48, 52, 55, 60] },
      { label: 'Conversion rate', value: '3.94%', delta: '+0.8%', up: true, icon: 'conversion', spark: [50, 52, 49, 47, 50, 46, 44, 45, 42, 40, 41, 38] },
      { label: 'Avg. session', value: '4m 32s', delta: '+6.1%', up: true, icon: 'cart', spark: [22, 25, 24, 27, 26, 29, 31, 30, 33, 32, 35, 37] },
      { label: 'API uptime', value: '99.98%', delta: '-0.02%', up: false, icon: 'uptime', spark: [20, 24, 22, 30, 34, 31, 40, 44, 48, 52, 58, 64] },
      { label: 'Bounce rate', value: '32.1%', delta: '+2.4%', up: false, icon: 'bounce', spark: [12, 14, 18, 24, 30, 34, 28, 22, 18, 14, 10, 8] },
      { label: 'Page views', value: '284.7k', delta: '+18.3%', up: true, icon: 'views', spark: [34, 30, 26, 18, 4, 10, 20, 30, 40, 50, 56, 60] },
      { label: 'New users', value: '8,421', delta: '+12.7%', up: true, icon: 'newusers', spark: [32, 28, 22, 14, 6, 14, 24, 34, 44, 52, 58, 62] },
      { label: 'Sessions', value: '45,892', delta: '+9.2%', up: true, icon: 'sessions', spark: [30, 26, 20, 12, 6, 14, 26, 38, 48, 56, 60, 64] },
    ];
    this.kpis = raw.map((k) => ({ ...k, sparkPath: this.sparkline(k.spark) }));
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      'Completed': 'completed',
      'Processing': 'processing',
      'In Progress': 'processing',
      'Pending': 'pending',
      'Attention Required': 'pending',
    };
    return map[status] || 'completed';
  }


  private sparkline(values: number[]): string {
    const w = 100;
    const h = 40;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const step = w / (values.length - 1);
    return values
      .map((v, i) => {
        const x = i * step;
        const y = h - 4 - ((v - min) / range) * (h - 8);
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
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
    this.endPoint = thisPts[thisPts.length - 1];
    this.midPoint = thisPts[Math.floor(thisPts.length / 2)];
    this.endPct = { x: (this.endPoint.x / W) * 100, y: (this.endPoint.y / H) * 100 };
    this.midPct = { x: (this.midPoint.x / W) * 100, y: (this.midPoint.y / H) * 100 };
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

  private buildDonut(): void {
    const r = 54;
    const circ = 2 * Math.PI * r;
    const raw: Omit<Source, 'dash' | 'offset'>[] = [
      { label: 'Organic', pct: 48, color: 'coral' },
      { label: 'Referral', pct: 27, color: 'amber' },
      { label: 'Social', pct: 15, color: 'rose' },
      { label: 'Direct', pct: 10, color: 'tan' },
    ];
    let acc = 0;
    this.sources = raw.map((s) => {
      const len = (s.pct / 100) * circ;
      const dash = len;
      const offset = -acc;
      acc += len;
      return { ...s, dash, offset };
    });
  }

  private buildGoal(): void {
    const r = 54;
    const circ = 2 * Math.PI * r;
    this.goalRingDash = `${(this.goalPct / 100) * circ} ${circ}`;
  }


}
