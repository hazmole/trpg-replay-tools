import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplayConfig } from 'src/app/interfaces/replay-info.interface';

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
    pageBgColor: new FormControl<string>(''),
    pageTitleColor: new FormControl<string>(''),
    scriptTalkBgColor: new FormControl<string>(''),
    scriptTalkPanelBgColor: new FormControl<string>(''),
    scriptTalkPanelTextColor: new FormControl<string>(''),
  });

  ngOnInit(): void {
    const rpCfg = this.rpManager.GetConfig();

    this.formGroup.controls.title.setValue(rpCfg.title || "未命名團錄");
    this.formGroup.controls.subTitle.setValue(rpCfg.subtitle || "");
    this.formGroup.controls.pageBgColor.setValue(rpCfg.colorTheme?.pageBgColor || "#454752");
    this.formGroup.controls.pageTitleColor.setValue(rpCfg.colorTheme?.pageTitleColor || "#FFFFFF");
    this.formGroup.controls.scriptTalkBgColor.setValue(rpCfg.colorTheme?.scriptTalkBgColor || "#1E1E1E");
    this.formGroup.controls.scriptTalkPanelBgColor.setValue(rpCfg.colorTheme?.scriptTalkPanelBgColor || "#2A2A2A");
    this.formGroup.controls.scriptTalkPanelTextColor.setValue(rpCfg.colorTheme?.scriptTalkPaneltextColor || "#EEEEEE");
  }


  Save(): void {
    const rpCfg:ReplayConfig = {
      title: this.formGroup.controls.title.value || "未命名團錄",
      subtitle: this.formGroup.controls.subTitle.value || undefined,
      colorTheme: {
        pageBgColor: (this.formGroup.controls.pageBgColor.value || undefined),
        pageTitleColor: (this.formGroup.controls.pageTitleColor.value || undefined),
        scriptTalkBgColor: (this.formGroup.controls.scriptTalkBgColor.value || undefined),
        scriptTalkPanelBgColor: (this.formGroup.controls.scriptTalkPanelBgColor.value || undefined),
        scriptTalkPaneltextColor: (this.formGroup.controls.scriptTalkPanelTextColor.value || undefined),
      },
    };
    this.rpManager.SetConfig(rpCfg);

    this.tool.PopupSuccessfulNotify("儲存成功！");
  }
}
