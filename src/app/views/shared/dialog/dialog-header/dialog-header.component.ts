import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogHeaderOptions } from 'src/app/interfaces/dialog-options.interface';

@Component({
  selector: 'app-dialog-header',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './dialog-header.component.html',
  styleUrl: './dialog-header.component.css'
})
export class DialogHeaderComponent implements OnInit {
  @Input() title: string = "";
  @Input() options: (DialogHeaderOptions | null) = null;

  ngOnInit(): void {
  }

  close(e:Event): void {
    if(this.options?.close?.click) this.options.close.click(e);
  }

}

