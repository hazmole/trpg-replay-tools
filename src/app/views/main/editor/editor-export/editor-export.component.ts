import { Component, OnInit } from '@angular/core';

import { ReplayManagerService } from 'src/app/services/replay-manager.service';

@Component({
  selector: 'app-editor-export',
  templateUrl: './editor-export.component.html',
  styleUrls: ['./editor-export.component.css']
})
export class EditorExportComponent implements OnInit  {

  constructor(private rpManager: ReplayManagerService){ }

  ngOnInit(): void {
    this.rpManager.Test();
  }
}
