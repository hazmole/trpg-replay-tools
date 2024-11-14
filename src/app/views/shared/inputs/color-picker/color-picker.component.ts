import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ControlContainer, FormGroupDirective} from '@angular/forms'

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.css',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule ],
  viewProviders:[{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class ColorPickerComponent {
  @Input({required: true}) formCtrl!: FormControl;

  ngOnInit(): void {
  }

  private oldVal:string = "";
  private colorCodeFormat = new RegExp(/#[0-9a-fA-F]{6}/);


  FocusColorText(e:Event): void {
    this.oldVal = this.formCtrl.value;
  }
  ChangeColorText(e:Event): void {
    let colorCode = (e.target as HTMLInputElement).value.toUpperCase();
    let matchMap = colorCode.match(this.colorCodeFormat);
    if (!matchMap || matchMap[0] !== colorCode) {
      this.formCtrl.setValue(this.oldVal);
    } 
  }
  ChangeColorPick(e:Event): void {
    let colorCode = (e.target as HTMLInputElement).value.toUpperCase();
    this.formCtrl.setValue(colorCode);
  }
}
