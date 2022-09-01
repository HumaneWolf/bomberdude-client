import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamePageComponent } from './views/game-page/game-page.component';
import { JoinPageComponent } from './views/join-page/join-page.component';
import { LobbyPageComponent } from './views/lobby-page/lobby-page.component';
import { ResultsPageComponent } from './views/results-page/results-page.component';

const routes: Routes = [
  {
    path: '',
    component: JoinPageComponent,
  },
  {
    path: 'play/lobby',
    component: LobbyPageComponent,
  },
  {
    path: 'play/game',
    component: GamePageComponent,
  },
  {
    path: 'play/results',
    component: ResultsPageComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
