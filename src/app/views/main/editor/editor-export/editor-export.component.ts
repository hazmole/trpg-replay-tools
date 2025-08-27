import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ReplayManagerService } from 'src/app/services/replay-manager.service';
import { ExporterService } from 'src/app/services/exporter.service';
import { ToolService } from 'src/app/services/tool.service';

@Component({
  selector: 'app-editor-export',
  templateUrl: './editor-export.component.html',
  styleUrls: ['./editor-export.component.css']
})
export class EditorExportComponent implements OnInit  {

  constructor(
    private rpManager: ReplayManagerService,
    private exporter: ExporterService,
  ){ }

  ngOnInit(): void {}

  OnChangeValue(key:string): void {}


  Preview(): void {
    const fileData = this.getFileData();
    
    var w = window.open('');
		w?.document.write(fileData);
  }

  Export(): void {
    const fileData = this.getFileData();
    const fileName = this.getFileName();
    
		var elem = document.createElement('a');
		elem.setAttribute('href','data:text/plain;charset=utf-8,' + encodeURIComponent(fileData));
		elem.setAttribute('download', fileName);
		document.body.appendChild(elem);
		elem.click();
  }


  private getFileName(): string {
    // let timestamp = new Date().toISOString().slice(0,10).replace(/[-:]/g, '');
    // let filename = this.rpManager.GetReplayConfig().filename;
    // return `${filename}_${timestamp}.html`;
    return this.rpManager.GetReplayConfig().filename;
  }
  private getFileData(): string {
    let rpCfg = this.rpManager.GetReplayConfig();
    return this.exporter.GenerateFile(rpCfg);
  }
}
