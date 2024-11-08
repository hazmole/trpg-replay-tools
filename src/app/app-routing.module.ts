import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WelcomeComponent } from './views/home/welcome/welcome.component';
import { EditorComponent } from './views/home/editor/editor.component';
import { PlayerComponent } from './views/home/player/player.component';

const webTitle_prefix = "哈絲的團錄工具 - ";

const routes: Routes = [
  { path: 'editor', component: EditorComponent, title: webTitle_prefix+'編輯器' },
  { path: 'player', component: PlayerComponent, title: webTitle_prefix+'播放器' },
  { path: '', component: WelcomeComponent, title: webTitle_prefix+'首頁' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
