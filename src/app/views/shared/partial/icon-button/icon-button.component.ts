import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.css'
})
export class IconButtonComponent implements OnInit {
  @Input() type: string = "";

  public imgUrl: string = "";
  public label: string = "";

  ngOnInit(): void {
    
    switch(this.type) {
      case "edit":
        this.label = "編輯";
        this.imgUrl = 'assets/images/scroll-quill.png';
        break;
      case "delete":
        this.label = "刪除";
        this.imgUrl = 'assets/images/cross.png';
        break;
    }
  }
}
