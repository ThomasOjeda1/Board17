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

  it('Should emit all the available issues upon subscription', () => {
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

  it('Should emit the available issues for a column upon subscription', () => {
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

  it('Should emit the added issue alongside the rest of the issues', () => {
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
  });

  it('Should emit the added issue alongside the rest of the column issues', () => {
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
  });

  it('Should retrieve the highest issue priority in the specified column', () => {
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

  it('Should emit all the available columns upon subscription', () => {
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

  it('Should emit all the available columns when a new column is added', () => {
    let expectedColumnsLength = 3;
    let expectedColumns = ['column1', 'column2', 'column3'];

    const spy = jasmine.createSpyObj('spy', ['call']);

    service.getColumns().subscribe((columns) => {
      spy.call();
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

    expect(spy.call)
      .withContext('Subscriber did not get called twice')
      .toHaveBeenCalledTimes(2);
  });
});
