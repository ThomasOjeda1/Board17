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
      column: 'column1',
    },
    {
      uniqueId: '0xAAC',
      title: 'Madrid',
      description: 'City',
      column: 'column1',
    },
    {
      uniqueId: '0xAAD',
      title: 'Uruguay',
      description: 'Country',
      column: 'column1',
    },
    {
      uniqueId: '0xAAE',
      title: 'Europe',
      description: 'Continent',
      column: 'column1',
    },
    {
      uniqueId: '0xAAF',
      title: 'Milky Way',
      description: 'Galaxy',
      column: 'column1',
    },
    {
      uniqueId: '0xAAG',
      title: 'London',
      description: 'City',
      column: 'column2',
    },
    {
      uniqueId: '0xAAH',
      title: 'Sun',
      description: 'Star',
      column: 'column2',
    },
    {
      uniqueId: '0xAAI',
      title: 'Jupiter',
      description: 'Planet',
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
