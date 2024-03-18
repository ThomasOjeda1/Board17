import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
export interface Issue {
  uniqueId: string;
  title: string;
  description: string;
  column: string;
  priority: number;
}
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

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
    {
      uniqueId: '0xAAI',
      title: 'Everest',
      description: 'Mountain',
      column: 'column3',
      priority: 0,
    },
    {
      uniqueId: '0xAAJ',
      title: 'Nile',
      description: 'River',
      column: 'column3',
      priority: 1,
    },
    {
      uniqueId: '0xAAK',
      title: 'Sahara',
      description: 'Desert',
      column: 'column3',
      priority: 2,
    },
  ];

  columns = ['column1', 'column2', 'column3'];

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

    let modifiedIssue = this.getIssue(draggedElementId);

    if (!modifiedIssue) return;

    let biggestPriority = this.getBigestPriorityInColumn(newColumnName);

    if (modifiedIssue.column !== newColumnName) biggestPriority++; //BUGFIX //This has to be fixed splitting the issue removal and issue reinsertion code

    this.moveIssue(modifiedIssue, biggestPriority, newColumnName);
  }

  moveIssueBeforeTargetInColumn(
    draggedElementId: string,
    dropTargetId: string,
    newColumnName: string
  ) {
    if (!this.isColumnAvailable(newColumnName)) return;
    let modifiedIssue = this.getIssue(draggedElementId);
    let dropTargetIssue = this.getIssue(dropTargetId);

    if (!modifiedIssue || !dropTargetIssue) return;

    this.moveIssue(modifiedIssue, dropTargetIssue.priority, newColumnName);
  }

  moveIssue(
    issue: Issue,
    destinationPriority: number,
    destinationColumn: string
  ) {
    let issueOriginalPriority = issue.priority;
    let issueOriginalColumn = issue.column;

    for (let i = 0; i < this.issues.length; i++) {
      //Adjust origin column priorities (drecrease them)
      if (
        this.issues[i].column === issueOriginalColumn &&
        this.issues[i].priority > issueOriginalPriority
      )
        this.issues[i].priority--;
    }
    //Adjust destination column priorities (increment them)
    for (let i = 0; i < this.issues.length; i++) {
      if (
        this.issues[i].column === destinationColumn &&
        this.issues[i].priority >= destinationPriority
      )
        this.issues[i].priority++;
    }

    issue.column = destinationColumn;
    issue.priority = destinationPriority;

    this.issuesEmitter.next(this.issues);
  }

  isColumnAvailable(column: string) {
    return this.columns.includes(column);
  }

  getIssue(id: string) {
    return this.issues.find((issue) => {
      return issue.uniqueId === id;
    });
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

  getBigestPriorityInColumn(column: string) {
    let biggestPriority = this.issues
      .filter((issue) => {
        return issue.column === column;
      })
      .map((issue) => {
        return issue.priority;
      })
      .reduce((prev, curr) => {
        if (curr > prev) return curr;
        else return prev;
      }, -1);
    if (biggestPriority === -1) return 0;
    else return biggestPriority;
  }

  newIssue(issue: Optional<Issue, 'uniqueId' | 'priority'>) {
    const priority = this.getBigestPriorityInColumn(issue.column) + 1;
    this.issues.push({
      uniqueId: uuidv4(),
      title: issue.title,
      description: issue.description,
      priority: priority,
      column: issue.column,
    });
    this.issuesEmitter.next(this.issues);
  }
  removeIssue() {}
}
