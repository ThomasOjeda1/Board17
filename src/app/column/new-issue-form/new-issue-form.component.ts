import { Component } from '@angular/core';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-new-issue-form',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './new-issue-form.component.html',
  styleUrl: './new-issue-form.component.scss',
})
export class NewIssueFormComponent {}
