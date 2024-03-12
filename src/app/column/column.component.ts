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
  @ViewChild('newIssueBtn', { read: ElementRef }) newIssueBtn!: ElementRef;

  issues!: Issue[];
  issues$!: Observable<Issue[]>;
  constructor(private issueService: IssuesMockService) {}

  ngOnInit() {
    /*     this.issueService.getIssues(this.columnName).subscribe((issueArray) => {
      this.issues = issueArray;
    }); */
    //this.issues$ = this.issueService.getIssues(this.columnName);

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
    let targetClasses = ($event.target as any).classList;
    let dropTarget = $event.target as HTMLElement;
    let dropTargetId;
    if (dropTarget.tagName === 'ARTICLE') {
      dropTargetId = dropTarget.parentElement?.parentElement?.id;
      console.log('dropTargetId: ', dropTargetId);
    }

    if (
      targetClasses.contains('dropZone') ||
      targetClasses.contains('newIssueBtnListElement')
    ) {
      /*       this.dropZone.nativeElement.insertBefore(
        document.getElementById(draggedElementId as string),
        this.newIssueBtn.nativeElement
      ); */

      this.issueService.moveIssueToColumn(draggedElementId, this.columnName);
    } else {
      /*       this.dropZone.nativeElement.insertBefore(
        document.getElementById(draggedElementId as string),
        document.getElementById($event.droppedOverIssueId)
      ); */

      this.issueService.moveIssueToLocationInColumn(
        draggedElementId,
        dropTargetId as string,
        this.columnName
      );
    }
  }
}
