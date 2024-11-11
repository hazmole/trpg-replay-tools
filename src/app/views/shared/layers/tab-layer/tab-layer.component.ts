import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab-layer',
  templateUrl: './tab-layer.component.html',
  styleUrls: ['./tab-layer.component.css']
})
export class TabLayerComponent {
  @Input() titleText: string = ""
  @Input() text: string = ""
}
