import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ReplayManagerService } from 'src/app/services/replay-manager.service';
import { ToolService } from 'src/app/services/tool.service';


@Component({
  selector: 'app-editor-config',
  templateUrl: './editor-config.component.html',
  styleUrl: './editor-config.component.css'
})
export class EditorConfigComponent implements OnInit {
  constructor(
    private rpManager: ReplayManagerService,
    private tool: ToolService,
  ){ }

  public formGroup = new FormGroup({
    title: new FormControl<string>('', Validators.required),
    subTitle:  new FormControl<string>(''),
  });

  ngOnInit(): void {
    const layoutCfg = this.rpManager.GetLayoutConfig();

    this.formGroup.controls.title.setValue(layoutCfg.title || "未命名團錄");
    this.formGroup.controls.subTitle.setValue(layoutCfg.subtitle || "");
  }


  Save(): void {
    const layoutCfg = this.rpManager.GetLayoutConfig();
    layoutCfg.title = (this.formGroup.controls.title.value || "未命名團錄");
    layoutCfg.subtitle = this.formGroup.controls.subTitle.value || "",

    this.rpManager.Save();
    this.tool.PopupSuccessfulNotify("儲存成功！");
  }
}
