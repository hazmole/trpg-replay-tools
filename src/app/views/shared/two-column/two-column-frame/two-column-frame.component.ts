import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
 
@Component({
  selector: 'app-two-column-frame',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './two-column-frame.component.html',
  styleUrl: './two-column-frame.component.css',
  styles: [ ':host { flex:1; min-height:0 }' ],
})
export class TwoColumnFrameComponent implements OnInit {
  @Input({ required: true }) text: string;
  @Input({ required: true }) itemList: Array<TwoColumnButtonEntry>;
  @Input({ required: true }) behavior: TwoColumnClickBehavior;
  
  // two-way binding
  public selectIdValue: string = "";
  @Output() modelChange = new EventEmitter<string>();
  @Input({ required: true }) 
  get model(): string { return this.selectIdValue }
  set model(val:string) { 
    this.selectIdValue = val;
    this.modelChange.emit(this.selectIdValue);
  }
  
  ngOnInit(): void {
  }
  public isModelSelected(): boolean {
    return !!this.model;
  }
  public SelectItem(item:TwoColumnButtonEntry): void {
    console.log(this.model, this.selectIdValue);
    if(this.model != item.id){
      this.model = item.id;
    } else {
      this.model = "";
    }
    this.behavior.select();
  }
  public AddItem(): void {
    this.behavior.add();
  }
}


export interface TwoColumnButtonEntry {
  id: string;
  text: string;
}
export interface TwoColumnClickBehavior {
  select: () => void;
  add: () => void;
}