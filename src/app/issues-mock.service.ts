import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map, of } from 'rxjs';

export interface Issue {
  uniqueId: string;
  title: string;
  description: string;
  column: string;
  priority: number;
}

@Injectable({
  providedIn: 'root',
})
export class IssuesMockService {
  droppedOnIssueId: string | null = null;

  issues = [
    {
      uniqueId: '0xAAA',
      title: 'America',
      description: 'Continent',
      column: 'column1',
      priority: 0,
    },
    {
      uniqueId: '0xAAB',
      title: 'Panama',
      description: 'Country',
      column: 'column1',
      priority: 1,
    },
    {
      uniqueId: '0xAAC',
      title: 'Madrid',
      description: 'City',
      column: 'column1',
      priority: 2,
    },
    {
      uniqueId: '0xAAD',
      title: 'Uruguay',
      description: 'Country',
      column: 'column1',
      priority: 3,
    },
    {
      uniqueId: '0xAAE',
      title: 'Europe',
      description: 'Continent',
      column: 'column1',
      priority: 4,
    },
    {
      uniqueId: '0xAAF',
      title: 'Milky Way',
      description: 'Galaxy',
      column: 'column1',
      priority: 5,
    },
    {
      uniqueId: '0xAAG',
      title: 'London',
      description: 'City',
      column: 'column2',
      priority: 0,
    },
    {
      uniqueId: '0xAAH',
      title: 'Sun',
      description: 'Star',
      column: 'column2',
      priority: 1,
    },
  ];

  columns = ['column1', 'column2'];

  issuesEmitter: BehaviorSubject<Issue[]> = new BehaviorSubject<Issue[]>(
    this.issues
  );

  columnsEmitter: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(
    this.columns
  );

  constructor() {}

  getIssues(column: string): Observable<Issue[]> {
    return this.issuesEmitter.pipe(
      map((issues) => {
        return issues
          .filter((issue) => {
            return issue.column === column;
          })
          .sort((issuea, issueb) => {
            return issuea.priority - issueb.priority;
          });
      })
    );
  }

  getColumns(): Observable<string[]> {
    return this.columnsEmitter.asObservable();
  }

  moveIssueToColumn(draggedElementId: string, newColumnName: string) {
    if (!this.isColumnAvailable(newColumnName)) return;

    let modifiedIssueIndex = this.issues.findIndex((issue) => {
      return issue.uniqueId === draggedElementId;
    });

    if (modifiedIssueIndex === -1) return;

    let modifiedIssue = this.issues[modifiedIssueIndex];

    let largestPriority = this.issues
      .filter((issue) => {
        return issue.column === newColumnName;
      })
      .map((issue) => {
        return issue.priority;
      })
      .reduce((prev, curr) => {
        if (curr > prev) return curr;
        else return prev;
      }, -1);
    modifiedIssue.priority = largestPriority + 1;

    modifiedIssue.column = newColumnName;

    this.issuesEmitter.next(this.issues);
  }

  moveIssueBeforeTargetInColumn(
    draggedElementId: string,
    dropTargetId: string,
    newColumnName: string
  ) {
    if (!this.isColumnAvailable(newColumnName)) return;
    let modifiedIssueIndex = this.issues.findIndex((issue) => {
      return issue.uniqueId === draggedElementId;
    });
    let dropTargetIssueIndex = this.issues.findIndex((issue) => {
      return issue.uniqueId === dropTargetId;
    });

    if (modifiedIssueIndex === -1 || dropTargetIssueIndex === -1) return;

    let modifiedIssue = this.issues[modifiedIssueIndex];
    let dropTargetIssue = this.issues[dropTargetIssueIndex];

    for (let i = 0; i < this.issues.length; i++) {
      //Adjust origin column priorities (drecrease them)
      if (
        this.issues[i].column === modifiedIssue.column &&
        this.issues[i].priority > modifiedIssue.priority
      )
        this.issues[i].priority--;
      //Adjust destination column priorities (increment them)
      if (
        this.issues[i].column === newColumnName &&
        this.issues[i].priority >= dropTargetIssue.priority
      )
        this.issues[i].priority++;
    }

    modifiedIssue.column = newColumnName;
    modifiedIssue.priority = dropTargetIssue.priority - 1;

    this.issuesEmitter.next(this.issues);
  }

  isColumnAvailable(column: string) {
    return this.columns.includes(column);
  }

  addNewColumn(newColumnName: string) {
    if (!this.isColumnAvailable(newColumnName))
      this.columns.push(newColumnName);
  }

  setDroppedOnIssueId(id: string) {
    this.droppedOnIssueId = id;
  }

  getDroppedOnIssueIdAndClear() {
    let id = this.droppedOnIssueId;
    this.droppedOnIssueId = null;
    return id;
  }

  addIssue() {}
  removeIssue() {}
}
