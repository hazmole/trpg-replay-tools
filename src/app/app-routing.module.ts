import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WelcomeComponent } from './views/home/welcome/welcome.component';
import { EditorComponent } from './views/home/editor/editor.component';
import { PlayerComponent } from './views/home/player/player.component';

const routes: Routes = [
  { path: 'editor', component: EditorComponent, title: '編輯器' },
  { path: 'player', component: PlayerComponent, title: '播放器' },
  { path: '', component: WelcomeComponent, title: '首頁' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
