import { Component } from '@angular/core';
import { ColumnComponent } from './column/column.component';
import { Observable } from 'rxjs';
import { IssuesMockService } from './issues-mock.service';
import { CommonModule } from '@angular/common';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ColumnComponent, CommonModule, CdkDropListGroup],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Board17';

  columns$!: Observable<string[]>;

  constructor(private issuesService: IssuesMockService) {}

  ngOnInit() {
    this.columns$ = this.issuesService.getColumns();
  }
}
