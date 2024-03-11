import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Issue {
  uniqueId: string;
  title: string;
  description: string;
  column: string;
}

@Injectable({
  providedIn: 'root',
})
export class IssuesMockService {
  issues = [
    {
      uniqueId: '0xAAA',
      title: 'America',
      description: 'Continent',
      column: 'column1',
    },
    {
      uniqueId: '0xAAB',
      title: 'Panama',
      description: 'Country',
      column: 'column2',
    },
    {
      uniqueId: '0xAAC',
      title: 'Pacific',
      description: 'Ocean',
      column: 'column1',
    },
  ];

  constructor() {}

  getIssues(column: string): Observable<Issue[]> {
    return of(
      this.issues.filter((issue) => {
        return issue.column === column;
      })
    );
  }
}
