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

  observer!: MutationObserver;

  ngAfterViewInit() {
    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = (mutationList: any, observer: any) => {
      for (const mutation of mutationList)
        if (mutation.type === 'attributes') {
          //debugger;
        }
    };

    // Create an observer instance linked to the callback function
    this.observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    this.observer.observe(this.theList.nativeElement, config);
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
