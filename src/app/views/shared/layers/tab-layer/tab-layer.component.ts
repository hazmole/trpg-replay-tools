import { Component, Input } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-tab-layer',
  templateUrl: './tab-layer.component.html',
  styleUrls: ['./tab-layer.component.css']
})
export class TabLayerComponent {
  @Input() titleText: string = ""
  @Input() text: string = ""

  constructor(
    public lang:LanguageService,
  ) {}
}
