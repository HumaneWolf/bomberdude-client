import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapTileComponent } from './map-tile/map-tile.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PlayerComponent } from './player/player.component';
import { OtherPlayerComponent } from './other-player/other-player.component';
import { BombComponent } from './bomb/bomb.component';

@NgModule({
  declarations: [
    MapTileComponent,
    PlayerComponent,
    OtherPlayerComponent,
    BombComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
  ],
  exports: [
    MapTileComponent,
    PlayerComponent,
    OtherPlayerComponent,
    BombComponent,
  ]
})
export class ItemsModule { }
