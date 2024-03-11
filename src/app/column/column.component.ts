import { Component, Input } from '@angular/core';
import { IssueComponent } from '../issue/issue.component';
import { CommonModule } from '@angular/common';
import { Issue, IssuesMockService } from '../issues-mock.service';

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [IssueComponent, CommonModule],
  templateUrl: './column.component.html',
  styleUrl: './column.component.scss',
})
export class ColumnComponent {
  @Input() columnName!: string;
  issues!: Issue[];
  constructor(private issueService: IssuesMockService) {}

  ngOnInit() {
    this.issueService.getIssues(this.columnName).subscribe((issueArray) => {
      this.issues = issueArray;
    });
  }

  configureDragStartEvent($event: DragEvent) {
    $event.dataTransfer?.setData('draggedElementId', ($event.target as any).id);
  }

  allowDrop(dragEndEvent: DragEvent) {
    if ((dragEndEvent.target as any).classList.contains('receivesDrops'))
      dragEndEvent.preventDefault();
  }

  finalizeDrop($event: DragEvent) {
    $event.preventDefault();
    let draggedElementId = $event.dataTransfer?.getData('draggedElementId');
    ($event.target as any).appendChild(
      document.getElementById(draggedElementId as string)
    );
  }
}
