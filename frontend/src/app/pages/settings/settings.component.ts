import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { TeamMember } from '../../services/api.types';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isLoading = false;
  isSaving = false;
  successMessage = '';
  errorMessage = '';

  user = {
    firstName: 'Jordan',
    lastName: 'Cox',
    email: 'jordan@craftflow.co',
  };

  notificationsEnabled = true;
  pushAlertsEnabled = false;
  darkMode = true;

  team: TeamMember[] = [
    { id: 1, name: 'Jordan Cox', email: 'jordan@craftflow.co', role: 'Admin', status: 'active' },
    { id: 2, name: 'Sam Rivera', email: 'sam@craftflow.co', role: 'Editor', status: 'active' },
    { id: 3, name: 'Taylor Kim', email: 'taylor@craftflow.co', role: 'Viewer', status: 'pending' },
  ];

  showAddMember = false;
  newMember = { name: '', email: '', role: 'Viewer' };
  isAddingMember = false;
  deletingMemberId: number | null = null;

  roles = ['Admin', 'Editor', 'Viewer'];

  constructor(
    private api: ApiService,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.darkMode = localStorage.getItem('theme') !== 'light';

    const stored = this.auth.getUser();
    if (stored) {
      this.user.firstName = stored.first_name || 'Jordan';
      this.user.lastName = stored.last_name || 'Cox';
      this.user.email = stored.email || 'jordan@craftflow.co';
    }

    this.api.getSettings().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.user.firstName = res.first_name || this.user.firstName;
        this.user.lastName = res.last_name || this.user.lastName;
        this.user.email = res.email || this.user.email;
        this.notificationsEnabled = res.notifications_enabled ?? true;
      },
      error: () => {},
    });

    this.loadTeam();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTeam(): void {
    this.api.getTeam().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.members?.length) {
          this.team = res.members;
        }
      },
      error: () => {},
    });
  }

  initials(name: string): string {
    return name.split(' ').map(w => w[0]).join('');
  }

  getAvatarUrl(name: string): string {
    const avatars: Record<string, string> = {
      'Jordan Cox': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
      'Sam Rivera': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
      'Taylor Kim': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    };
    return avatars[name] || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ff4500&color=fff&size=80`;
  }

  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', this.darkMode ? 'dark' : 'light');
  }

  toggleNotifications(): void {
    this.notificationsEnabled = !this.notificationsEnabled;
  }

  togglePushAlerts(): void {
    this.pushAlertsEnabled = !this.pushAlertsEnabled;
  }

  save(): void {
    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.api.updateSettings({
      first_name: this.user.firstName,
      last_name: this.user.lastName,
      notifications_enabled: this.notificationsEnabled,
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.isSaving = false;
        this.successMessage = 'Settings saved successfully';
        this.auth.setUser({
          id: this.auth.getUser()?.id || 0,
          email: this.user.email,
          first_name: this.user.firstName,
          last_name: this.user.lastName,
        });
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.message || 'Failed to save settings';
        setTimeout(() => this.errorMessage = '', 3000);
      },
    });
  }

  addMember(): void {
    if (!this.newMember.name.trim() || !this.newMember.email.trim()) return;
    this.isAddingMember = true;
    this.errorMessage = '';

    this.api.createTeamMember({
      name: this.newMember.name.trim(),
      email: this.newMember.email.trim(),
      role: this.newMember.role,
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.isAddingMember = false;
        if (res.member) {
          this.team = [...this.team, res.member];
        } else {
          this.team = [...this.team, {
            id: Date.now(),
            name: this.newMember.name.trim(),
            email: this.newMember.email.trim(),
            role: this.newMember.role,
            status: 'pending',
          }];
        }
        this.newMember = { name: '', email: '', role: 'Viewer' };
        this.showAddMember = false;
        this.successMessage = 'Team member added';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.isAddingMember = false;
        this.errorMessage = err.message || 'Failed to add member';
        setTimeout(() => this.errorMessage = '', 3000);
      },
    });
  }

  deleteMember(member: TeamMember): void {
    if (!confirm(`Remove ${member.name} from the team?`)) return;
    this.deletingMemberId = member.id;
    this.errorMessage = '';

    this.api.deleteTeamMember(member.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.team = this.team.filter(m => m.id !== member.id);
        this.deletingMemberId = null;
        this.successMessage = 'Team member removed';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.deletingMemberId = null;
        this.errorMessage = err.message || 'Failed to remove member';
        setTimeout(() => this.errorMessage = '', 3000);
      },
    });
  }

  cancelAdd(): void {
    this.showAddMember = false;
    this.newMember = { name: '', email: '', role: 'Viewer' };
  }
}
