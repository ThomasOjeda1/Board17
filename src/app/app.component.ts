import { Component } from '@angular/core';
import { ColumnComponent } from './column/column.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ColumnComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Board17';
}
