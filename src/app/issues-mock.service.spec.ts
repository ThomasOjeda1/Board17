import { TestBed } from '@angular/core/testing';

import { IssuesMockService } from './issues-mock.service';
import { take } from 'rxjs';
import { Serializer } from '@angular/compiler';

describe('IssuesMockService', () => {
  let service: IssuesMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssuesMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('method getAllIssues should emit all the available issues upon subscription', () => {
    service.getAllIssues().subscribe((issues) => {
      expect(issues)
        .withContext('The issues array was not truthy')
        .toBeTruthy();
      expect(issues.length).withContext('Issue count was not 11').toEqual(11);

      const panamaIssue = issues.find((issue) => {
        return issue.uniqueId === '80fbcf04-0b02-4167-9d90-674e48aeae73';
      });
      expect(panamaIssue).withContext('Panama issue not found').toBeTruthy();
      expect(panamaIssue?.title)
        .withContext('Issue title was not "Panama"')
        .toEqual('Panama');
    });
  });

  it('method getColumnIssues should emit the available issues for a column upon subscription', () => {
    service.getColumnIssues('column2').subscribe((issues) => {
      expect(issues)
        .withContext('The issues array was not truthy')
        .toBeTruthy();
      expect(issues.length).withContext('Issue count was not 2').toEqual(2);
      const londonIssue = issues.find((issue) => {
        return issue.uniqueId === '57984318-6291-4edd-ba73-ac9874f57718';
      });
      expect(londonIssue).withContext('London issue not found').toBeTruthy();
      expect(londonIssue?.title)
        .withContext('Issue title was not "London"')
        .toEqual('London');
    });
  });

  it('method getAllIssues should emit the added issue alongside the rest of the issues', () => {
    spyOn(service.issuesEmitter$, 'next').and.callThrough();

    const newIssue = service.addNewIssue({
      title: 'mockTitle',
      description: 'mockDescription',
      column: 'column1',
    });

    service.getAllIssues().subscribe((issues) => {
      expect(issues).toBeTruthy();
      expect(issues.length)
        .withContext('Issues array length was not 12')
        .toEqual(12);
      expect(
        issues.find((issue) => {
          return issue.uniqueId === newIssue.uniqueId;
        })
      )
        .withContext('Emitted issue array does not contain the added issue')
        .toEqual(newIssue);
    });
    expect(service.issuesEmitter$.next)
      .withContext('issuesEmmiter$ has not emitted a value')
      .toHaveBeenCalledTimes(1);
  });

  it('method getColumnIssues should emit the added issue alongside the rest of the column issues', () => {
    spyOn(service.issuesEmitter$, 'next').and.callThrough();
    const newIssue = service.addNewIssue({
      title: 'mockTitle',
      description: 'mockDescription',
      column: 'column1',
    });

    service.getColumnIssues('column1').subscribe((issues) => {
      expect(issues).toBeTruthy();
      expect(issues.length)
        .withContext('Issues array length was not 7')
        .toEqual(7);
      expect(
        issues.find((issue) => {
          return issue.uniqueId === newIssue.uniqueId;
        })
      )
        .withContext('Emitted issue array does not contain the added issue')
        .toEqual(newIssue);
    });
    expect(service.issuesEmitter$.next)
      .withContext('issuesEmitter$ has not emitted a value')
      .toHaveBeenCalledTimes(1);
  });

  it('method getHighestPriorityIncolumn should retrieve the highest issue priority in the specified column', () => {
    let testPriorityExpectations = (expected: number, obtained: number) => {
      expect(obtained)
        .withContext(`Priority should equal ${expected}`)
        .toEqual(expected);
    };

    let expectedHighestPriority = 5;
    testPriorityExpectations(
      expectedHighestPriority,
      service.getHighestPriorityInColumn('column1')
    );

    let newIssue = {
      title: 'mockTitle',
      description: 'mockDescription',
      column: 'column1',
    };
    service.addNewIssue(newIssue);
    expectedHighestPriority = 6;
    testPriorityExpectations(
      expectedHighestPriority,
      service.getHighestPriorityInColumn('column1')
    );

    service.addNewColumn('NEW_COLUMN');
    expectedHighestPriority = 0;
    testPriorityExpectations(
      expectedHighestPriority,
      service.getHighestPriorityInColumn('NEW_COLUMN')
    );
  });

  it('method getColumns should emit all the available columns upon subscription', () => {
    service.getColumns().subscribe((columns) => {
      expect(columns)
        .withContext('The columns array was not truthy')
        .toBeTruthy();
      expect(columns.length)
        .withContext('The columns count was not 3')
        .toEqual(3);
      expect(columns[2]).toEqual('column3');
    });
  });

  it('method getColumns should emit all the available columns when a new column is added', () => {
    spyOn(service.columnsEmitter$, 'next').and.callThrough();
    let expectedColumnsLength = 3;
    let expectedColumns = ['column1', 'column2', 'column3'];

    let timesCalled = 0;

    service.getColumns().subscribe((columns) => {
      timesCalled++;
      expect(columns).withContext('Should exist').toBeTruthy();
      expect(columns.length)
        .withContext(`Should have length ${expectedColumnsLength}`)
        .toEqual(expectedColumnsLength);
      expect(columns)
        .withContext(`Should equal ${expectedColumns}`)
        .toEqual(expectedColumns);
    });

    expectedColumnsLength = 4;
    expectedColumns = ['column1', 'column2', 'column3', 'column4'];

    service.addNewColumn('column4');

    expect(timesCalled)
      .withContext('Subscriber did not get called twice')
      .toEqual(2);

    expect(service.columnsEmitter$.next)
      .withContext('columnsEmitter$ has not emitted a value')
      .toHaveBeenCalledTimes(1);
  });

  it('method moveIssueToColumn should move an issue from a column to the last priority place of another column', () => {
    spyOn(service, 'getHighestPriorityInColumn').and.callThrough();
    const issueId = '8e4984f5-0b55-4f02-a7d0-f379586b2088';
    service.moveIssueToColumn(issueId, 'column2');
    service
      .getColumnIssues('column1')
      .pipe(take(1))
      .subscribe((issues) => {
        expect(
          issues.findIndex((issue) => {
            return issue.uniqueId === issueId;
          })
        )
          .withContext('Issue was not removed from its original column')
          .toEqual(-1);
        expect(
          issues.find((issue) => {
            return issue.uniqueId === '5886fab2-9206-4807-9a70-006571bf19ae';
          })?.priority
        )
          .withContext(
            'Issue that used to be next (in priority) of moved issue does not have the correct priority (4)'
          )
          .toEqual(4);
      });

    service
      .getColumnIssues('column2')
      .pipe(take(1))
      .subscribe((issues) => {
        let issueIndex = issues.findIndex((issue) => {
          return issue.uniqueId === issueId;
        });
        expect(issueIndex)
          .withContext('Issue was not added to its destination column')
          .toBeGreaterThan(-1);
        expect(issues[issueIndex].priority)
          .withContext(
            'Issue was not added with the correct priority (2) in the destination column'
          )
          .toEqual(2);
      });

    expect(service.getHighestPriorityInColumn)
      .withContext('method getHighestPriorityInColumn has not been called')
      .toHaveBeenCalledTimes(1);
  });

  it('method moveIssueToColumn should move an issue to the last priority place of its column', () => {
    spyOn(service, 'getHighestPriorityInColumn').and.callThrough();

    const issueId = '82ef7159-6beb-4f10-a105-af82a807d1fc';
    service.moveIssueToColumn(issueId, 'column1');
    service
      .getColumnIssues('column1')
      .pipe(take(1))
      .subscribe((issues) => {
        const issueThatUsedToBePriority0 = issues.find((issue) => {
          return issue.uniqueId === issueId;
        });
        expect(issueThatUsedToBePriority0).withContext(
          'Moved issue was not found'
        ).toBeTruthy;

        expect(issueThatUsedToBePriority0?.priority)
          .withContext(
            'Issue priority was not updated to the correct value (5)'
          )
          .toEqual(5);

        const issueThatUsedToBePriority1 = issues.find((issue) => {
          return (issue.uniqueId = '80fbcf04-0b02-4167-9d90-674e48aeae73');
        });

        expect(issueThatUsedToBePriority1)
          .withContext('Issue that used to be after moved issue was not found')
          .toBeTruthy();

        expect(issueThatUsedToBePriority1?.priority)
          .withContext(
            'Issue that used to be after moved issue does not have the correct priority (0)'
          )
          .toEqual(0);
      });
    expect(service.getHighestPriorityInColumn)
      .withContext('method getHighestPriorityInColumn has not been called')
      .toHaveBeenCalledTimes(1);
  });

  it('method getIssue should return an issue or undefined if none was found', () => {
    const existentIssue = service.getIssue(
      '5886fab2-9206-4807-9a70-006571bf19ae'
    );

    expect(existentIssue).withContext('The issue does not exist').toBeTruthy();

    expect(existentIssue?.title)
      .withContext('The issue title is not "Milky Way"')
      .toEqual('Milky Way');

    const nonExistentissue = service.getIssue('not-a-valid-id');

    expect(nonExistentissue).withContext('The issue exist').toBeUndefined();
  });

  it('method isColumnAvailable should return boolean value true if the column exists and false otherwise', () => {
    expect(service.isColumnAvailable('column2'))
      .withContext('column does not exist')
      .toBeTrue();

    expect(service.isColumnAvailable('nonExistantColumn'))
      .withContext('column exists')
      .toBeFalse();
  });

  it(
    'method moveIssueBeforeTargetInColumn should move an issue to a column and set it to a lower priority than the target'
  ),
    () => {
      ///COMPLETE
    };
});
