import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { environment } from 'src/environments/environment';

import { WelcomeComponent } from './views/main/welcome/welcome.component';
import { EditorComponent } from './views/main/editor/editor.component';
import { PlayerComponent } from './views/main/player/player.component';

const webTitle_prefix = "哈絲的團錄工具 - ";

const routes: Routes = [
  { path: environment.baseRoute+'editor', component: EditorComponent,  title: webTitle_prefix+'編輯器' },
  { path: environment.baseRoute+'player', component: PlayerComponent,  title: webTitle_prefix+'播放器' },
  { path: environment.baseRoute+'',   component: WelcomeComponent, title: webTitle_prefix+'首頁' },
  { path: '**', redirectTo: environment.baseRoute+'' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
