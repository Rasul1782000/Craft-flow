import { Component } from '@angular/core';

@Component({
  selector: 'app-library',
  standalone: false,
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})
export class LibraryComponent {
  goBack(): void {
    window.history.back();
  }
}
