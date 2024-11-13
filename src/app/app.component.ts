import { Component, Inject, OnInit } from '@angular/core';
import { ViewContainerRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { environment } from 'src/environments/environment';
import { StorageManagerService } from 'src/app/services/storage-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public viewRef: ViewContainerRef,
    private storage: StorageManagerService,
  ) {}

  ngOnInit(): void {
      let bases = this.document.getElementsByTagName('base');
      if (bases.length > 0) {
        bases[0].setAttribute('url', environment.baseHref);
      }

      setTimeout(()=>{
        this.storage.Load();
      }, 0);
  }

  title = '哈絲的團錄工具';
  version = "0.01";

  navbarArr = [
    { title: '首頁',   url: 'home' },
    { title: '編輯器', url: 'editor' },
    { title: '播放器', url: 'player' },
  ];
  public currentTabKey:string = "home";

  public clickTab(newTab:string) {
    this.currentTabKey = newTab;
  }
}
