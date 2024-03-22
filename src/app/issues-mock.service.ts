import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { mockColumns, mockIssues } from './mockData';
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

  issues = structuredClone(mockIssues); //Alternative: spread operator [...mockIssues], otherwise every instance of the service uses the same variable.

  columns = structuredClone(mockColumns); //Alternative: spread operator [...mockColumns], otherwise every instance of the service uses the same variable.

  issuesEmitter$: BehaviorSubject<Issue[]> = new BehaviorSubject<Issue[]>(
    this.issues
  );

  columnsEmitter$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(
    this.columns
  );

  constructor() {}

  getAllIssues(): Observable<Issue[]> {
    return this.issuesEmitter$.asObservable();
  }

  getColumnIssues(column: string): Observable<Issue[]> {
    return this.issuesEmitter$.pipe(
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
    return this.columnsEmitter$.asObservable();
  }

  moveIssueToColumn(draggedElementId: string, newColumnName: string) {
    if (!this.isColumnAvailable(newColumnName)) return;

    let modifiedIssue = this.getIssue(draggedElementId);

    if (!modifiedIssue) return;

    let highestPriority = this.getHighestPriorityInColumn(newColumnName);

    if (modifiedIssue.column !== newColumnName) highestPriority++; //BUGFIX //This has to be fixed splitting the issue removal and issue reinsertion code

    this.moveIssue(modifiedIssue, highestPriority, newColumnName);
  }

  moveIssueBeforeTargetInColumn(
    //Have to TEST what happens if the origin and destination are the same issue
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

  //HAVE TO TEST
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

    this.issuesEmitter$.next(this.issues);
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
    if (!this.isColumnAvailable(newColumnName)) {
      this.columns.push(newColumnName);
      this.columnsEmitter$.next(this.columns);
    }
  }

  getHighestPriorityInColumn(column: string) {
    let highestPriority = this.issues
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
    if (highestPriority === -1) return 0;
    else return highestPriority;
  }

  addNewIssue(issue: Optional<Issue, 'uniqueId' | 'priority'>) {
    const priority = this.getHighestPriorityInColumn(issue.column) + 1;

    const newIssue = {
      uniqueId: uuidv4(),
      title: issue.title,
      description: issue.description,
      priority: priority,
      column: issue.column,
    };
    this.issues.push(newIssue);
    this.issuesEmitter$.next(this.issues);
    return newIssue;
  }

  //HAVE TO TEST
  removeIssue() {}
}
