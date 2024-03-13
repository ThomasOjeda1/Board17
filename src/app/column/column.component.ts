import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { IssueComponent } from '../issue/issue.component';
import { CommonModule } from '@angular/common';
import { Issue, IssuesMockService } from '../issues-mock.service';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [IssueComponent, CommonModule],
  templateUrl: './column.component.html',
  styleUrl: './column.component.scss',
})
export class ColumnComponent {
  @Input() columnName!: string;

  @ViewChild('dropZone', { read: ElementRef }) dropZone!: ElementRef;

  issues$!: Observable<Issue[]>;
  constructor(private issueService: IssuesMockService) {}

  ngOnInit() {
    this.issues$ = this.issueService.getIssues(this.columnName);
  }

  configureDragStartEvent($event: DragEvent) {
    $event.dataTransfer?.setData('draggedElementId', ($event.target as any).id);
  }

  allowDrop(dragEndEvent: DragEvent) {
    dragEndEvent.preventDefault();
  }

  finalizeDropOnZone($event: any) {
    let draggedElementId = $event.dataTransfer?.getData('draggedElementId');
    let droppedOnIssueId = this.issueService.getDroppedOnIssueIdAndClear();
    if (droppedOnIssueId === null) {
      this.issueService.moveIssueToColumn(draggedElementId, this.columnName);
    } else {
      this.issueService.moveIssueBeforeTargetInColumn(
        draggedElementId,
        droppedOnIssueId,
        this.columnName
      );

      this.issueService.droppedOnIssueId = null;
    }
  }

  registerTargetIssue($event: DragEvent) {
    this.issueService.setDroppedOnIssueId(
      ($event.currentTarget as HTMLElement).id
    );
  }
}
