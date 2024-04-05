import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { NewIssueFormComponent } from './new-issue-form.component';
import { MatDialogRef } from '@angular/material/dialog';
import { IssuesMockService } from '../../issues-mock.service';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MatButton } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectHarness } from '@angular/material/select/testing';
import { of } from 'rxjs';

describe('NewIssueFormComponent', () => {
  let component: NewIssueFormComponent;
  let fixture: ComponentFixture<NewIssueFormComponent>;
  let el: DebugElement;
  let dialogRefServiceSpy: any;
  let issueServiceSpy: any;
  let harnessLoader: HarnessLoader;

  beforeEach(async () => {
    dialogRefServiceSpy = jasmine.createSpyObj('dialogRef', ['close']);
    issueServiceSpy = jasmine.createSpyObj('issueService', [
      'addNewIssue',
      'getColumns',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        NewIssueFormComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefServiceSpy },
        { provide: IssuesMockService, useValue: issueServiceSpy },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(NewIssueFormComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        harnessLoader = TestbedHarnessEnvironment.loader(fixture);
      });
  });

  it('should get destroyed when the submit button is pressed', () => {
    spyOn(component, 'ngOnDestroy').and.callThrough();

    dialogRefServiceSpy.close.and.callFake(() => {
      //fixture.destroy(); does not work, ngondestroy() is always called before destroy()
      component.ngOnDestroy();
    });

    component.addIssue();

    expect(component.ngOnDestroy)
      .withContext('component did not get destroyed')
      .toHaveBeenCalledTimes(1);
  });

  it('should display a disabled submit button at the start', fakeAsync(() => {
    fixture.detectChanges();

    const button = el.query(By.directive(MatButton));

    expect(button).withContext('submit button is not present').toBeTruthy();

    expect(button.nativeElement.attributes['disabled'])
      .withContext('submit button was enabled at the start')
      .toBeTruthy();
  }));

  it('should display an enabled submit button when title field is not empty', () => {
    component.titleControl.setValue('aMockedValue');

    fixture.detectChanges();

    const button = el.query(By.directive(MatButton));

    expect(button.attributes['disabled'])
      .withContext('submit button was disabled with a non-empty title field')
      .toBeFalsy();
  });

  it('should display an error message when title input is touched and empty', () => {
    const titleErrorCssClass = '.title-error-message';
    let errorMessage = el.query(By.css(titleErrorCssClass));
    expect(errorMessage).withContext('error message was present').toBeFalsy();

    component.titleControl.setValue('mockValue');
    component.titleControl.markAsTouched();
    fixture.detectChanges();
    errorMessage = el.query(By.css(titleErrorCssClass));
    expect(errorMessage).withContext('error message was present').toBeFalsy();

    component.titleControl.setValue(undefined);
    component.titleControl.markAsTouched();
    fixture.detectChanges();
    errorMessage = el.query(By.css(titleErrorCssClass));
    expect(errorMessage)
      .withContext('error message was not present')
      .toBeTruthy();
  });

  it('should display the default column as the selected option at the start', async () => {
    const mockedValue = 'mockColumn';
    issueServiceSpy.getColumns.and.returnValue(of([mockedValue])); //The input does not change in the html if the child options do not match
    fixture.componentRef.setInput('column', mockedValue);

    expect(component.columnControl.value)
      .withContext(
        'the column control value has not been set to the correct default value'
      )
      .toEqual(mockedValue); //this tests if the input model is corretly set up

    fixture.detectChanges();
    let matSelectHarness = await harnessLoader.getHarness(MatSelectHarness);
    let shownValue = await matSelectHarness.getValueText();
    expect(shownValue)
      .withContext('select input did not show expected initial value')
      .toBe(mockedValue); //This tests if the html is correctly showing the mocked value
  });

  it('should display a dropdown input for the available column list', async () => {
    let expectedOptions = ['column1', 'column2', 'column3', 'column4'];

    issueServiceSpy.getColumns.and.returnValue(of(expectedOptions));

    fixture.detectChanges();

    let selectHarness = await harnessLoader.getHarness(MatSelectHarness); //Obtain matSelectInput handler

    await selectHarness.open(); //Simulate that user opened the dropdown menu

    const matHarnessOptions = await selectHarness.getOptions();

    let actualOptions: string[] = [];

    for (let index = 0; index < matHarnessOptions.length; index++) {
      const optionValue = await matHarnessOptions[index].getText();
      actualOptions.push(optionValue);
    }

    expect(actualOptions)
      .withContext('options shown in dropdown menu were not correct')
      .toEqual(expectedOptions);
  });

  it('should display a text area field for the issue description', () => {
    const textArea = el.query(By.css('.description-text-area'));

    expect(textArea)
      .withContext('did not display a text area field')
      .toBeTruthy();
  });
});
