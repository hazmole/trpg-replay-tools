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
  public selectIdValue: number = -1;
  @Output() modelChange = new EventEmitter<number>();
  @Input({ required: true }) 
  get model(): number { return this.selectIdValue }
  set model(val:number) { 
    this.selectIdValue = val;
    this.modelChange.emit(this.selectIdValue);
  }
  
  ngOnInit(): void {
  }
  public SelectItem(item:TwoColumnButtonEntry): void {
    if(this.model != item.id){
      this.model = item.id;
    } else {
      this.model = -1;
    }
    this.behavior.select();
  }
  public AddItem(): void {
    this.behavior.add();
  }
}


export interface TwoColumnButtonEntry {
  id: number;
  text: string;
}
export interface TwoColumnClickBehavior {
  select: () => void;
  add: () => void;
}