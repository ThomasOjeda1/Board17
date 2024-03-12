import { Component, ElementRef, Input, ViewChild } from '@angular/core';
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

  @ViewChild('dropZone', { read: ElementRef }) dropZone!: ElementRef;
  @ViewChild('newIssueBtn', { read: ElementRef }) newIssueBtn!: ElementRef;

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
    dragEndEvent.preventDefault();
  }

  finalizeDropOnZone($event: DragEvent) {
    let draggedElementId = $event.dataTransfer?.getData('draggedElementId');
    let targetClasses = ($event.target as any).classList;

    if (targetClasses.contains('dropZone')) {
      this.dropZone.nativeElement.insertBefore(
        document.getElementById(draggedElementId as string),
        this.newIssueBtn.nativeElement
      );
    }
  }

  finalizeDropOnIssue($event: DragEvent) {
    console.log(this.columnName);
    let draggedElementId = $event.dataTransfer?.getData('draggedElementId');
    console.log(this.dropZone.nativeElement);
    this.dropZone.nativeElement.insertBefore(
      document.getElementById(draggedElementId as string),
      $event.currentTarget
    );
  }
}
