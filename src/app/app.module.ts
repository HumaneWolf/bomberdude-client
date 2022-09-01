import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameService } from './services/game.service';
import { JoinPageComponent } from './views/join-page/join-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './shared/app-material/app-material.module';
import { LobbyStateService } from './services/lobby-state.service';
import { LobbyPageComponent } from './views/lobby-page/lobby-page.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GamePageComponent } from './views/game-page/game-page.component';
import { ItemsModule } from './views/game-page/items/items.module';
import { ResultsPageComponent } from './views/results-page/results-page.component';

@NgModule({
  declarations: [
    AppComponent,
    JoinPageComponent,
    LobbyPageComponent,
    GamePageComponent,
    ResultsPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FontAwesomeModule,
    ItemsModule,
  ],
  providers: [
    GameService,
    LobbyStateService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
