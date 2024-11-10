import { Component, Input, ElementRef } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

const elemHeight = 160;

@Component({
  selector: 'app-notify-message',
  templateUrl: './notify-message.component.html',
  styleUrls: ['./notify-message.component.css'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [

      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({opacity: 1, top: elemHeight+"px"})),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [
        style({opacity: 0, top: ((elemHeight+20)+"px")}),
        animate(200)
      ]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave',
        animate(100, style({opacity: 0, top: (elemHeight-20)+"px"})))
    ])
  ]
})
export class NotifyMessageComponent {
  @Input() level: string = "warn";
  @Input() message: string = "";

  constructor(private host: ElementRef<HTMLElement>){}

  showModel: boolean = true;

  public close(): void {
    this.showModel = false;
    setTimeout(()=>{
      this.host.nativeElement.remove();
    }, 500);
  }
}
