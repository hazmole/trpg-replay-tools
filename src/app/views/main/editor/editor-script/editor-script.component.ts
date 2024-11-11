import { Component, OnInit } from '@angular/core';
import {CdkDragDrop} from '@angular/cdk/drag-drop';

import { ReplayManagerService } from 'src/app/services/replay-manager.service';
import { ToolService } from 'src/app/services/tool.service';

import { ScriptEntry } from 'src/app/interfaces/replay-info.interface';

@Component({
  selector: 'app-editor-script',
  templateUrl: './editor-script.component.html',
  styleUrls: ['./editor-script.component.css']
})
export class EditorScriptComponent implements OnInit {

  constructor(
    private rpManager: ReplayManagerService,
    private tool: ToolService,
  ){ }

  public entryList: Array<ScriptEntry> = [];

  ngOnInit(): void {
    this.initList();
  }

  initList(): void {
    this.entryList = Object.values(this.rpManager.GetScriptEntryList());
  }

  drop(event:CdkDragDrop<any, any, any>): void {
    let prevIdx = (event.previousIndex);
    let currIdx = (event.currentIndex);

    // Remove
    const elem = this.entryList.splice(prevIdx, 1)[0];
    // Append
    this.entryList.splice(currIdx, 0, elem);

  }

}
