import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { IssueComponent } from '../issue/issue.component';
import { CommonModule } from '@angular/common';
import { Issue, IssuesMockService } from '../issues-mock.service';
import { Observable, tap } from 'rxjs';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-column',
  standalone: true,
  imports: [IssueComponent, CommonModule, CdkDrag, CdkDropList],
  templateUrl: './column.component.html',
  styleUrl: './column.component.scss',
})
export class ColumnComponent {
  @Input() columnName!: string;

  @ViewChild('dropZone', { read: ElementRef }) dropZone!: ElementRef;

  issues$!: Observable<Issue[]>;
  constructor(private issueService: IssuesMockService) {}
  issues!: Issue[];

  ngOnInit() {
    this.issues$ = this.issueService.getIssues(this.columnName);
    this.issueService.getIssues(this.columnName).subscribe((issues) => {
      this.issues = issues;
    });
  }

  issueDropped($event: CdkDragDrop<string[]>) {
    /*     console.log(
      this.issues[$event.previousIndex].uniqueId,
      this.issues[$event.currentIndex].uniqueId,
      this.columnName
    ); */
    this.issueService.moveIssueBeforeTargetInColumn(
      this.issues[$event.previousIndex].uniqueId,
      this.issues[$event.currentIndex].uniqueId,
      this.columnName
    );
  }
}
