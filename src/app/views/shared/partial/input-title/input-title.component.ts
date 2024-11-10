import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input-title',
  templateUrl: './input-title.component.html',
  styleUrls: ['./input-title.component.css']
})
export class InputTitleComponent {
  @Input() titleText: string = "";


}
