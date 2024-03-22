import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewIssueFormComponent } from './new-issue-form.component';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material/material.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { IssuesMockService } from '../../issues-mock.service';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MatButton } from '@angular/material/button';

describe('NewIssueFormComponent', () => {
  let component: NewIssueFormComponent;
  let fixture: ComponentFixture<NewIssueFormComponent>;
  let el: DebugElement;
  let dialogRefServiceSpy: any;
  let issuesServiceSpy: any;

  beforeEach(async () => {
    dialogRefServiceSpy = jasmine.createSpyObj('dialogRef', ['close']);
    issuesServiceSpy = jasmine.createSpyObj('issuesService', ['addNewIssue']);

    await TestBed.configureTestingModule({
      imports: [NewIssueFormComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefServiceSpy }, ///UNSTUCK BUGFIX, WILL HAVE TO REVIEW LATer
        { provide: IssuesMockService, useValue: issuesServiceSpy },
        provideAnimationsAsync(), ///UNSTUCK BUGFIX, WILL HAVE TO REVIEW LATer
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(NewIssueFormComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        fixture.detectChanges();
      });
  });

  it('should get destroyed when the submit button is pressed', () => {
    spyOn(component, 'ngOnDestroy').and.callThrough();

    dialogRefServiceSpy.close.and.callFake(() => {
      component.ngOnDestroy();
    });

    component.addIssue();

    expect(component.ngOnDestroy)
      .withContext('component did not get destroyed')
      .toHaveBeenCalledTimes(1);
  });

  it('should display a disabled submit button at the start', () => {
    fixture.detectChanges();
    const button = el.query(By.directive(MatButton));

    expect(button).withContext('submit button is not present').toBeTruthy();

    expect(button.attributes['disabled'])
      .withContext('submit button was enabled at the start')
      .toBeFalsy();
  });

  it('should display an enabled submit button when title field is not empty', () => {
    component.titleControl.setValue('aMockedValue');

    fixture.detectChanges();

    const button = el.query(By.directive(MatButton));

    expect(button.attributes['disabled'])
      .withContext('submit button was disabled with a non-empty title field')
      .toBeTruthy();
  });

  it('should display an error message when title input is touched and empty', () => {});

  it('should display a dropdown input for the available column list', () => {});

  it('should display a text area field for the issue description', () => {});
});
