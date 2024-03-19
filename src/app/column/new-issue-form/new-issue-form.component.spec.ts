import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewIssueFormComponent } from './new-issue-form.component';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material/material.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('NewIssueFormComponent', () => {
  let component: NewIssueFormComponent;
  let fixture: ComponentFixture<NewIssueFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewIssueFormComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} }, ///UNSTUCK BUGFIX, WILL HAVE TO REVIEW LATer
        provideAnimationsAsync(), ///UNSTUCK BUGFIX, WILL HAVE TO REVIEW LATer
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewIssueFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
