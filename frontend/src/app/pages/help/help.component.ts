import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-help',
  standalone: false,
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isLoading = true;

  categories = [
    {
      name: 'Getting Started',
      icon: 'rocket',
      articles: [
        { title: 'Setting up your workspace', views: '12.8k' },
        { title: 'Inviting team members', views: '8.2k' },
        { title: 'Understanding the dashboard', views: '6.7k' },
      ],
    },
    {
      name: 'Billing & Plans',
      icon: 'credit-card',
      articles: [
        { title: 'Managing your subscription', views: '9.4k' },
        { title: 'Invoice and payment history', views: '5.8k' },
        { title: 'Upgrading your plan', views: '4.2k' },
      ],
    },
    {
      name: 'Account Management',
      icon: 'user',
      articles: [
        { title: 'Changing your password', views: '7.1k' },
        { title: 'Configuring notifications', views: '3.8k' },
        { title: 'Data export and privacy', views: '2.5k' },
      ],
    },
    {
      name: 'Integrations',
      icon: 'plugs',
      articles: [
        { title: 'Connecting to Slack', views: '5.6k' },
        { title: 'GitHub integration guide', views: '4.9k' },
        { title: 'API documentation', views: '3.4k' },
      ],
    },
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getHelp().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.categories && res.categories.length) {
          this.categories = res.categories.map((c, i) => ({
            name: c.name,
            icon: this.categories[i]?.icon || 'rocket',
            articles: c.articles.map((a) => ({
              title: a.title,
              views: a.views >= 1000 ? `${(a.views / 1000).toFixed(1)}k` : a.views.toString(),
            })),
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

}
