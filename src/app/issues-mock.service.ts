import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
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
      uniqueId: '82ef7159-6beb-4f10-a105-af82a807d1fc',
      title: 'America',
      description: 'Continent',
      column: 'column1',
      priority: 0,
    },
    {
      uniqueId: '80fbcf04-0b02-4167-9d90-674e48aeae73',
      title: 'Panama',
      description: 'Country',
      column: 'column1',
      priority: 1,
    },
    {
      uniqueId: '546a49bf-d7ed-4780-ae50-1a3ae7d47da0',
      title: 'Madrid',
      description: 'City',
      column: 'column1',
      priority: 2,
    },
    {
      uniqueId: 'd0fb7738-4dac-45a9-b4f1-78eeabbd6917',
      title: 'Uruguay',
      description: 'Country',
      column: 'column1',
      priority: 3,
    },
    {
      uniqueId: '8e4984f5-0b55-4f02-a7d0-f379586b2088',
      title: 'Europe',
      description: 'Continent',
      column: 'column1',
      priority: 4,
    },
    {
      uniqueId: '5886fab2-9206-4807-9a70-006571bf19ae',
      title: 'Milky Way',
      description: 'Galaxy',
      column: 'column1',
      priority: 5,
    },
    {
      uniqueId: '57984318-6291-4edd-ba73-ac9874f57718',
      title: 'London',
      description: 'City',
      column: 'column2',
      priority: 0,
    },
    {
      uniqueId: '650989ca-e749-404f-b8b5-22c9850c28f2',
      title: 'Sun',
      description: 'Star',
      column: 'column2',
      priority: 1,
    },
    {
      uniqueId: '888cc1cd-eb7b-41c6-8055-d219e2fb22d9',
      title: 'Everest',
      description: 'Mountain',
      column: 'column3',
      priority: 0,
    },
    {
      uniqueId: 'cb104d51-8f11-4683-bfa2-70e8148bd699',
      title: 'Nile',
      description: 'River',
      column: 'column3',
      priority: 1,
    },
    {
      uniqueId: 'c41ff44d-44af-4b5c-bd44-8e65b604ea2b',
      title: 'Sahara',
      description: 'Desert',
      column: 'column3',
      priority: 2,
    },
  ];

  columns = ['column1', 'column2', 'column3'];

  issuesEmitter$: BehaviorSubject<Issue[]> = new BehaviorSubject<Issue[]>(
    this.issues
  );

  columnsEmitter$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(
    this.columns
  );

  constructor() {}

  getIssues(column: string): Observable<Issue[]> {
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
    this.issuesEmitter$.next(this.issues);
  }
  removeIssue() {}
}
