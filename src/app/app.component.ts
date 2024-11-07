import { Component, Inject, OnInit } from '@angular/core';

import { environment } from 'src/environments/environment';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
      let bases = this.document.getElementsByTagName('base');
      if (bases.length > 0) {
        bases[0].setAttribute('url', environment.baseHref);
      }
  }

  title = '哈絲的團錄工具';
  version = "0.01";
  navbarArr = [
    { title: '首頁', url: '' },
    { title: '編輯器', url: 'editor' },
    { title: '播放器', url: 'player' },
  ];

}
