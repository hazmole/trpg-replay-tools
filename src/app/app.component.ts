import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = '哈絲的團錄工具';
  version = "0.01";
  navbarArr = [
    { title: '編輯器', url: 'editor' },
    { title: '播放器', url: 'player' },
  ];
}
