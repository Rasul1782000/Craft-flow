import { Component } from '@angular/core';

@Component({
  selector: 'app-docs',
  standalone: false,
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss'],
})
export class DocsComponent {
  goBack(): void {
    window.history.back();
  }
}
