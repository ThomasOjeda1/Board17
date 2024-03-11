import { TestBed } from '@angular/core/testing';

import { IssuesMockService } from './issues-mock.service';

describe('IssuesMockService', () => {
  let service: IssuesMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssuesMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
