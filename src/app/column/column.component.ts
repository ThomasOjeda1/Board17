import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { IssueComponent } from '../issue/issue.component';
import { CommonModule } from '@angular/common';
import { Issue, IssuesMockService } from '../issues-mock.service';
import { Observable, tap } from 'rxjs';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MaterialModule } from '../material/material.module';
import { TriggerDebugger } from '../TriggerDebugger';
import { MatDialog } from '@angular/material/dialog';
import { NewIssueFormComponent } from './new-issue-form/new-issue-form.component';

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [IssueComponent, CommonModule, MaterialModule],
  templateUrl: './column.component.html',
  styleUrl: './column.component.scss',
})
export class ColumnComponent {
  @Input() columnName!: string;

  issues$!: Observable<Issue[]>;
  constructor(
    private issueService: IssuesMockService,
    public dialogService: MatDialog
  ) {}

  issues!: Issue[];

  @ViewChild('list', { read: ElementRef }) theList!: ElementRef;

  ngOnInit() {
    this.issues$ = this.issueService.getColumnIssues(this.columnName).pipe(
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

  issueDropped($event: CdkDragDrop<string>) {
    console.log($event.previousContainer.data); //WITH THIS AND THE PREVIOUS INDEX I CAN CALL ISSUE MOCK SERVICE AND RETRIEVE THE ID OF THE ISSUE
    //It was dropped over an issue
    if (this.issueExistsInThisColumn($event.currentIndex))
      this.issueService.moveIssueBeforeTargetInColumn(
        //THIS IS SOOOO NOT COOL; USE THE ISSUE SERVICE TO LOOKUP THE ELEMENT ID!!
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

  openNewIssueDialog() {
    const dialogRef = this.dialogService.open(NewIssueFormComponent);
    dialogRef.componentRef?.setInput('column', this.columnName);
  }
}
