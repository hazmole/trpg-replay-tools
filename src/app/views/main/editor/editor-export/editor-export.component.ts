import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ReplayManagerService } from 'src/app/services/replay-manager.service';
import { ExporterService } from 'src/app/services/exporter.service';
import { ToolService } from 'src/app/services/tool.service';
import { ConfigKey } from 'src/app/interfaces/replay-info.interface';

@Component({
  selector: 'app-editor-export',
  templateUrl: './editor-export.component.html',
  styleUrls: ['./editor-export.component.css']
})
export class EditorExportComponent implements OnInit  {

  constructor(
    private rpManager: ReplayManagerService,
    private exporter: ExporterService,
    private tool: ToolService,
  ){ }

  public formGroup = new FormGroup({
    title: new FormControl<string>('', Validators.required),
    subTitle:  new FormControl<string>(''),
    //time:  new FormControl<string>(''),
  });

  ngOnInit(): void {
    //let today = new Date().toISOString().slice(0, 10);

    const rpCfg = this.rpManager.GetConfig();
    if(!rpCfg.title) this.rpManager.SetConfig("title", "未命名標題")

    this.formGroup.controls.title.setValue(rpCfg.title || "");
    //this.formGroup.controls.time.setValue(today);
  }


  OnChangeValue(key:string): void {
    switch(key) {
      case "title":
        this.rpManager.SetConfig("title", (this.formGroup.controls["title"].value || ""));
        break;
      case "subTitle":
        this.rpManager.SetConfig("subtitle", (this.formGroup.controls["subTitle"].value || ""));
        break;
    }
  }


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
    let timestamp = new Date().toISOString().slice(0,10).replace(/[-:]/g, '');
    let text = (this.formGroup.controls.title.value || "未命名標題");

    return `${timestamp}-${text}.html`;
  }
  private getFileData(): string {
    let rpInfo = this.rpManager.GetInfo();
    return this.exporter.GenerateFile(rpInfo);
  }
}
