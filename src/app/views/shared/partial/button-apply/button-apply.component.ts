import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button-apply',
  templateUrl: './button-apply.component.html',
  styleUrls: ['./button-apply.component.css']
})
export class ButtonApplyComponent {
  @Input() text: string = "";
  @Input() type: string = "";

}
