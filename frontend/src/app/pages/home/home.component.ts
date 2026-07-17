import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private cleanupFns: Array<() => void> = [];
  private intervalId: number | null = null;

  constructor(private host: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const root = this.host.nativeElement;

    const revealEls = Array.from(
      root.querySelectorAll<HTMLElement>('.reveal')
    );

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
    this.cleanupFns.push(() => revealObserver.disconnect());

    const nav = root.querySelector<HTMLElement>('#main-nav');
    const onNavbarScroll = () => {
      if (!nav) return;
      if (window.scrollY > 50) {
        nav.classList.add('py-4', 'bg-[#050505]/80', 'backdrop-blur-md', 'border-b', 'border-white/5');
        nav.classList.remove('py-8', 'bg-transparent');
      } else {
        nav.classList.remove('py-4', 'bg-[#050505]/80', 'backdrop-blur-md', 'border-b', 'border-white/5');
        nav.classList.add('py-8', 'bg-transparent');
      }
    };

    window.addEventListener('scroll', onNavbarScroll, { passive: true });
    this.cleanupFns.push(() => window.removeEventListener('scroll', onNavbarScroll));
    onNavbarScroll();

    const onParallax = () => {
      const scrolled = window.scrollY;
      root.querySelectorAll<HTMLElement>('.parallax-card-up').forEach((el) => {
        el.style.setProperty('--scroll-offset-up', `${scrolled * -0.05}px`);
      });
      root.querySelectorAll<HTMLElement>('.parallax-card-down').forEach((el) => {
        el.style.setProperty('--scroll-offset-down', `${scrolled * 0.05}px`);
      });
    };

    window.addEventListener('scroll', onParallax, { passive: true });
    this.cleanupFns.push(() => window.removeEventListener('scroll', onParallax));
    onParallax();

    const updateTime = () => {
      const clockEl = root.querySelector<HTMLElement>('#current-time');
      if (!clockEl) return;
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      clockEl.textContent = `${hours}:${minutes} ${ampm}`;
    };

    this.intervalId = window.setInterval(updateTime, 60000);
    updateTime();

    this.cleanupFns.push(() => {
      if (this.intervalId != null) {
        window.clearInterval(this.intervalId);
        this.intervalId = null;
      }
    });

    const heroWrapper = root.querySelector<HTMLElement>('#hero-content-wrapper');
    const onHeroParallax = () => {
      if (!heroWrapper) return;
      const scrolled = window.scrollY;
      if (scrolled < 1000) {
        heroWrapper.style.transform = `translateY(${scrolled * 0.4}px)`;
        heroWrapper.style.opacity = `${Math.max(0, 1 - scrolled / 600)}`;
      }
    };

    window.addEventListener('scroll', onHeroParallax, { passive: true });
    this.cleanupFns.push(() => window.removeEventListener('scroll', onHeroParallax));
    onHeroParallax();
  }

  ngOnDestroy(): void {
    for (const fn of this.cleanupFns) fn();
    this.cleanupFns = [];
    if (this.intervalId != null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
