import { Component, Input } from '@angular/core';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { GamePlayer } from 'src/models/games';

@Component({
  selector: 'app-other-player',
  template: `
  <div class="player" [style.width]="playerSizePx" [style.height]="playerSizePx" [style.background]="player?.color">
    <span class="player-name">{{ player?.name }}</span>
    <span><fa-icon [icon]="faHeart"></fa-icon> {{ player?.health }}</span>
  </div>`,
  styleUrls: ['./other-player.component.scss']
})
export class OtherPlayerComponent {
  faHeart = faHeart;

  @Input() tileSize: number = 100;
  get playerSize() { return this.tileSize * this.relativePlayerSize; }
  get playerSizePx() { return `${this.playerSize}px`; }

  @Input() player?: GamePlayer;

  relativePlayerSize = 0.8;
}
