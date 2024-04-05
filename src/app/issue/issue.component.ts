import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-issue',
  standalone: true,
  imports: [],
  templateUrl: './issue.component.html',
  styleUrl: './issue.component.scss',
  animations: [
    trigger('clickedState', [
      state(
        'default',
        style({
          backgroundColor: 'orange',
        })
      ),
      state(
        'clicked',
        style({
          backgroundColor: 'yellow',
        })
      ),
      transition('clicked <=> default', animate('200ms 300ms ease-in'))
    ]),
    trigger('issueEnter', [
      state(
        'in',
        style({
          opacity: 1,
          transform: 'translateY(0)'
        })
      ),
      transition('void => *', [style({opacity: 0,transform:'translateY(100px)'}),animate(300)])
    ]),
    
  ],
})
export class IssueComponent {}
