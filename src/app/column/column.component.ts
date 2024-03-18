import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { IssueComponent } from '../issue/issue.component';
import { CommonModule } from '@angular/common';
import { Issue, IssuesMockService } from '../issues-mock.service';
import { Observable, tap } from 'rxjs';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { MaterialModule } from '../material/material.module';
import { TriggerDebugger } from '../TriggerDebugger';
@Component({
  selector: 'app-column',
  standalone: true,
  imports: [IssueComponent, CommonModule, CdkDrag, CdkDropList, MaterialModule],
  templateUrl: './column.component.html',
  styleUrl: './column.component.scss',
})
export class ColumnComponent {
  @Input() columnName!: string;

  issues$!: Observable<Issue[]>;
  constructor(private issueService: IssuesMockService) {}
  issues!: Issue[];

  @ViewChild('list', { read: ElementRef }) theList!: ElementRef;

  ngOnInit() {
    this.issues$ = this.issueService.getIssues(this.columnName).pipe(
      tap((data) => {
        this.issues = data;
      })
    );
  }

  ngAfterViewInit() {
    let debuggerHelper = new TriggerDebugger(
      this.theList.nativeElement,
      { attributes: true, childList: true, subtree: true },
      (mutationList: any, observer: any) => {
        for (const mutation of mutationList)
          if (mutation.type === 'attributes') {
            //debugger;
          }
      }
    );

    debuggerHelper.startObserving();
  }

  issueDropped($event: CdkDragDrop<string[]>) {
    //It was dropped over an issue
    if (this.issueExistsInThisColumn($event.currentIndex))
      this.issueService.moveIssueBeforeTargetInColumn(
        $event.previousContainer.element.nativeElement.children[
          $event.previousIndex
        ].id,
        this.issues[$event.currentIndex].uniqueId,
        this.columnName
      );
    //It was dropped over the list
    else {
      this.issueService.moveIssueToColumn(
        $event.previousContainer.element.nativeElement.children[
          $event.previousIndex
        ].id,
        this.columnName
      );
    }
  }

  issueExistsInThisColumn(index: number) {
    return this.issues[index];
  }
}
