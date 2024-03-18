import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { IssuesMockService } from '../../issues-mock.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-issue-form',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './new-issue-form.component.html',
  styleUrl: './new-issue-form.component.scss',
})
export class NewIssueFormComponent {
  @Input() public set column(v: string) {
    this.columnControl.setValue(v);
  }
  @Input()
  public set title(v: string) {
    this.titleControl.setValue(v);
  }
  @Input() public set description(v: string) {
    this.descriptionControl.setValue(v);
  }

  titleControl = new FormControl();
  columnControl = new FormControl();
  descriptionControl = new FormControl();

  constructor(
    private issueService: IssuesMockService,
    public dialogRef: MatDialogRef<NewIssueFormComponent>
  ) {}

  addIssue() {
    this.issueService.newIssue({
      column: this.columnControl.value,
      title: this.titleControl.value,
      description: this.descriptionControl.value,
    });
    this.dialogRef.close();
  }
}
