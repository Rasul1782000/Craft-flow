import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

export interface DateRangeOption {
  id: string;
  label: string;
  days: number | null;
}

@Component({
  selector: 'app-dashboard-shell',
  standalone: false,
  templateUrl: './dashboard-shell.component.html',
  styleUrls: ['./dashboard-shell.component.scss'],
})
export class DashboardShellComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() title = 'Overview';
  @Input() greeting = '';
  @Input() hideSearch = false;
  @Input() selectedRangeId = '30d';

  @Output() searchChange = new EventEmitter<string>();
  @Output() rangeChange = new EventEmitter<DateRangeOption>();

  activeNav = 'dashboard';
  userName = 'Jordan Cox';

  searchQuery = '';

  dateRanges: DateRangeOption[] = [
    { id: '7d', label: 'Last 7 days', days: 7 },
    { id: '30d', label: 'Last 30 days', days: 30 },
    { id: '90d', label: 'Last 90 days', days: 90 },
    { id: 'all', label: 'All time', days: null },
  ];

  rangeOpen = false;

  get userInitials(): string {
    const parts = this.userName.split(' ');
    if (parts.length >= 2) {
      return parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
    }
    return this.userName.charAt(0);
  }

  navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { id: 'wallet', label: 'Revenue', icon: 'wallet', route: '/dashboard/revenue' },
    { id: 'users', label: 'Customers', icon: 'users', route: '/dashboard/customers' },
    { id: 'receipt', label: 'Invoices', icon: 'receipt', route: '/dashboard/invoices', badge: 2 },
    { id: 'properties', label: 'Properties', icon: 'properties', route: '/dashboard/properties' },
    { id: 'settings', label: 'Settings', icon: 'settings', route: '/dashboard/settings' },
  ];

  helpBadge = 1;

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    const theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);

    this.syncNavFromUrl(this.router.url);
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.syncNavFromUrl(this.router.url));
    const user = this.auth.getUser();
    if (user) {
      const first = user.first_name || 'Jordan';
      const last = user.last_name || 'Cox';
      this.userName = `${first} ${last}`;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get activeRange(): DateRangeOption {
    return this.dateRanges.find((r) => r.id === this.selectedRangeId) || this.dateRanges[1];
  }

  onSearch(value: string): void {
    this.searchQuery = value;
    this.searchChange.emit(value);
  }

  toggleRange(): void {
    this.rangeOpen = !this.rangeOpen;
  }

  selectRange(option: DateRangeOption): void {
    this.selectedRangeId = option.id;
    this.rangeOpen = false;
    this.rangeChange.emit(option);
  }

  private syncNavFromUrl(url: string): void {
    const item = this.navItems.find((n) => n.route === url);
    const isHelp = url === '/dashboard/help';
    this.activeNav = item ? item.id : isHelp ? 'help' : 'dashboard';
  }

  setNav(item: any): void {
    this.router.navigate([item.route]);
  }

  goHelp(): void {
    this.router.navigate(['/dashboard/help']);
  }

  logout(): void {
    this.auth.logout();
  }
}
